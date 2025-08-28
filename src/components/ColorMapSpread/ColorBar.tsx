import { ColorBarOptions, ColorMap, makeColorBar } from "autumnplot-gl";
import React from "react";

interface ColorBarProps extends ColorBarOptions {
    cmap: ColorMap
}

export function ColorBar(props: ColorBarProps) : React.ReactNode {
    const {cmap: cmap, ...opts} = props;
    const cbar = makeColorBar(cmap, opts);

    const ref = React.useRef(null);

    React.useEffect(() => {
        ref.current.innerHTML = "";
        ref.current.appendChild(cbar);
    });

    return <div ref={ref}></div>
}