import { JSX } from 'solid-js'

interface PathIconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  path: string
}

export default function PathIcon(props: PathIconProps) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={props.path} />
    </svg>
  )
}
