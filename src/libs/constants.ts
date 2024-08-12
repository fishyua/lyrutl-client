import gsap, { Power4 } from 'gsap'
import CustomEase from 'gsap/CustomEase'
gsap.registerPlugin(CustomEase)

export const updInfoSeparator = '/%&;/'

export const lrcAnimTarget: gsap.TweenTarget = '#lyrics>div'
export const lrcAnimDelay = 0.017
export const lrcEasing = CustomEase.create('custom', 'M0,0 C0.4,0.14 0.1,1 1,1')
export const lrcEasingDur = 766 // ms
export const lrcEasingOffset = 3 / 10 // percentage
export const lrcGap = 2.7 // rem
export const lrcTween: gsap.TweenVars = {
  ease: lrcEasing,
  duration: lrcEasingDur / 1000,
}

export const uiEasing = Power4.easeOut
export const uiEasingDur = 500
export const uiTween: gsap.TweenVars = {
  ease: uiEasing,
  duration: uiEasingDur / 1000,
}
