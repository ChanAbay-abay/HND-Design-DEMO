"use client"

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { cn } from "@/lib/utils"

/* --------------------------------
 * Types
 ----------------------------------- */
export interface GalleryItem {
  image: string
  text: string
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An array of image and text objects for the gallery.
   */
  items?: GalleryItem[]
  /**
   * The amount of curvature. Higher values create a stronger bend.
   * @default 3
   */
  bend?: number
  /**
   * The border radius for the images, as a percentage (0.0 to 0.5).
   * @default 0.05
   */
  borderRadius?: number
  /**
   * Multiplier for scroll interaction speed.
   * @default 2
   */
  scrollSpeed?: number
  /**
   * Easing factor for the scroll animation (lower is smoother).
   * @default 0.05
   */
  scrollEase?: number
  /**
   * Optional class name to override the default font (e.g., from Next/font).
   */
  fontClassName?: string
}

/* --------------------------------
 * OGL Helper Utilities
 ----------------------------------- */
function debounce(func: (...args: unknown[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (
      key !== "constructor" &&
      typeof (instance as Record<string, unknown>)[key] === "function"
    ) {
      ;(instance as Record<string, unknown>)[key] = (
        instance as Record<string, (...args: unknown[]) => unknown>
      )[key].bind(instance)
    }
  })
}

/* --------------------------------
 * OGL Classes
 ----------------------------------- */
class Media {
  gl: OGLRenderingContext
  geometry: Plane
  image: string
  index: number
  length: number
  renderer: Renderer
  scene: Transform
  screen: { width: number; height: number }
  text: string
  viewport: { width: number; height: number }
  bend: number
  textColor: string
  borderRadius: number
  font: string
  program!: Program
  plane!: Mesh
  extra: number = 0
  widthTotal: number = 0
  width: number = 0
  x: number = 0
  scale: number = 1
  padding: number = 2
  speed: number = 0
  isBefore: boolean = false
  isAfter: boolean = false

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: {
    geometry: Plane
    gl: OGLRenderingContext
    image: string
    index: number
    length: number
    renderer: Renderer
    scene: Transform
    screen: { width: number; height: number }
    text: string
    viewport: { width: number; height: number }
    bend: number
    textColor: string
    borderRadius: number
    font: string
  }) {
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.createMesh()
    this.onResize()
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);

          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ]
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    })
    this.plane.setParent(this.scene)
  }

  update(
    scroll: { current: number; last: number },
    direction: "left" | "right"
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)

      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: { width: number; height: number }
    viewport?: { width: number; height: number }
  } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  container: HTMLElement
  wheelTarget!: HTMLElement
  scrollSpeed: number
  scroll: {
    ease: number
    current: number
    target: number
    last: number
    position: number
  }
  onCheckDebounce: () => void
  renderer!: Renderer
  gl!: OGLRenderingContext
  camera!: Camera
  scene!: Transform
  planeGeometry!: Plane
  mediasImages!: GalleryItem[]
  medias!: Media[]
  isDown: boolean = false
  start: number = 0
  screen!: { width: number; height: number }
  viewport!: { width: number; height: number }
  raf!: number
  boundOnResize!: () => void
  boundOnWheel!: (e: WheelEvent) => void
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void
  boundOnTouchUp!: () => void

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    }: {
      items?: GalleryItem[]
      bend: number
      textColor: string
      borderRadius: number
      font: string
      scrollSpeed: number
      scrollEase: number
    }
  ) {
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = {
      ease: scrollEase,
      current: 0,
      target: 0,
      last: 0,
      position: 0,
    }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)

    autoBind(this)

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene() {
    this.scene = new Transform()
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    })
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems: GalleryItem[] = [
      {
        image: `https://picsum.photos/seed/1/800/600?grayscale`,
        text: "Bridge",
      },
      {
        image: `https://picsum.photos/seed/2/800/600?grayscale`,
        text: "Desk Setup",
      },
      {
        image: `https://picsum.photos/seed/3/800/600?grayscale`,
        text: "Waterfall",
      },
    ]

    const galleryItems = items && items.length > 0 ? items : defaultItems
    this.mediasImages = [...galleryItems, ...galleryItems]
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      })
    })
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return
    const x = "touches" in e ? e.touches[0].clientX : e.clientX
    // Map finger movement 1:1 with on-screen movement (pixels -> viewport
    // units) so dragging tracks the touch point exactly, like native scroll.
    const distance =
      (this.start - x) * (this.viewport.width / this.screen.width)
    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp() {
    this.isDown = false
    this.onCheck()
  }

  onWheel(e: WheelEvent) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    this.scroll.target += delta * (this.scrollSpeed * 0.05)
    this.onCheckDebounce()
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  step(direction: 1 | -1) {
    if (!this.medias || !this.medias[0]) return
    this.scroll.target += direction * this.medias[0].width
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      )
    }
  }

  update() {
    // While actively dragging, follow the finger closely but with a touch of
    // smoothing so it doesn't feel rigid/snappy — still much tighter than the
    // slower ease used for the post-release snap/momentum settle.
    const ease = this.isDown ? 0.35 : this.scroll.ease
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, ease)
    const direction = this.scroll.current > this.scroll.last ? "right" : "left"
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update)
  }

  addEventListeners() {
    this.boundOnResize = this.onResize
    this.boundOnWheel = this.onWheel
    this.boundOnTouchDown = this.onTouchDown
    this.boundOnTouchMove = this.onTouchMove
    this.boundOnTouchUp = this.onTouchUp

    // Scope wheel-driven scroll to the whole enclosing section (header,
    // copy, and canvas alike), not the tiny canvas div or the entire page.
    this.wheelTarget = this.container.closest("section") ?? this.container

    window.addEventListener("resize", this.boundOnResize)
    this.wheelTarget.addEventListener("wheel", this.boundOnWheel, {
      passive: true,
    })
    // Large screens scroll via wheel/trackpad instead of click-drag.
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      this.container.addEventListener("mousedown", this.boundOnTouchDown)
      window.addEventListener("mousemove", this.boundOnTouchMove)
      window.addEventListener("mouseup", this.boundOnTouchUp)
    }
    this.container.addEventListener("touchstart", this.boundOnTouchDown)
    window.addEventListener("touchmove", this.boundOnTouchMove)
    window.addEventListener("touchend", this.boundOnTouchUp)
  }

  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener("resize", this.boundOnResize)
    this.wheelTarget.removeEventListener("wheel", this.boundOnWheel)
    this.container.removeEventListener("mousedown", this.boundOnTouchDown)
    window.removeEventListener("mousemove", this.boundOnTouchMove)
    window.removeEventListener("mouseup", this.boundOnTouchUp)
    this.container.removeEventListener("touchstart", this.boundOnTouchDown)
    window.removeEventListener("touchmove", this.boundOnTouchMove)
    window.removeEventListener("touchend", this.boundOnTouchUp)

    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

/* --------------------------------
 * React Component
 ----------------------------------- */
export interface CircularGalleryHandle {
  /** Steps the gallery back by one item, snapped to the item pitch. */
  scrollPrev: () => void
  /** Steps the gallery forward by one item, snapped to the item pitch. */
  scrollNext: () => void
}

const CircularGallery = forwardRef<CircularGalleryHandle, CircularGalleryProps>(
  (
    {
      items,
      bend = 3,
      borderRadius = 0.05,
      scrollSpeed = 2,
      scrollEase = 0.05,
      className,
      fontClassName,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const appRef = useRef<App | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        scrollPrev: () => appRef.current?.step(-1),
        scrollNext: () => appRef.current?.step(1),
      }),
      []
    )

    useEffect(() => {
      if (!containerRef.current) return

      const computedStyle = getComputedStyle(containerRef.current)
      const computedColor = computedStyle.color || "hsl(var(--foreground))"
      const computedFontWeight = computedStyle.fontWeight || "bold"
      const computedFontSize = computedStyle.fontSize || "30px"
      const computedFontFamily = computedStyle.fontFamily

      const computedFont = `${computedFontWeight} ${computedFontSize} ${computedFontFamily}`

      const app = new App(containerRef.current, {
        items,
        bend,
        textColor: computedColor,
        borderRadius,
        font: computedFont,
        scrollSpeed,
        scrollEase,
      })
      appRef.current = app

      return () => {
        appRef.current = null
        app.destroy()
      }
    }, [items, bend, borderRadius, scrollSpeed, scrollEase, fontClassName])

    return (
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing lg:cursor-auto lg:active:cursor-auto",
          "text-foreground text-[30px] font-bold",
          fontClassName,
          className
        )}
        {...props}
      />
    )
  }
)
CircularGallery.displayName = "CircularGallery"

export { CircularGallery }
