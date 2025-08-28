import { useColorMode } from "@docusaurus/theme-common";
import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";


export function ColorMapSpread() : React.ReactNode {
    const cb_info = {
        'pw_speed500mb': {label: 'Wind Speed (kts)', ticks: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]},
        'pw_speed850mb': {label: 'Wind Speed (kts)', ticks: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]},
        'pw_t2m': {label: 'Temperature (\u00b0F)', ticks: [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]},
        'pw_td2m': {label: 'Dewpoint Temperature (\u00b0F)', ticks: [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]},
        'pw_cape': {label: 'CAPE (J/kg)', ticks: [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 10000]},
        'nws_storm_clear_refl': {label: 'Reflectivity (dBZ)', ticks: [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70]},
        'redblue': {label: '', ticks: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10], lower: -10, upper: 10, ncolors: 20},
        'bluered': {label: '', ticks: [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10], lower: -10, upper: 10, ncolors: 20},
    };

    const {colorMode: color_mode} = useColorMode();
    const color_mode_ref = React.useRef(color_mode);

    color_mode_ref.current = color_mode;

    return (
        <table><tbody><BrowserOnly>
            {() => Object.entries(cb_info).map(([name, cmap_info]) => {
                const colormaps = require('autumnplot-gl').colormaps;
                const ColorBar = require('./ColorBar').ColorBar;

                let cmap = colormaps[name];
                let display_name = name;
                if ('lower' in cmap_info && 'upper' in cmap_info && 'ncolors' in cmap_info) {
                    cmap = cmap(cmap_info.lower, cmap_info.upper, cmap_info.ncolors);
                    display_name = `${name}(${cmap_info.lower}, ${cmap_info.upper}, ${cmap_info.ncolors})`;
                }

                return (<tr key={name}>
                    <th>{display_name}</th>
                    <td><ColorBar
                         cmap={cmap}
                         label={cmap_info.label}
                         fontface="var(--ifm-font-family-base)"
                         ticks={cmap_info.ticks}
                         orientation="horizontal"
                         tick_direction="bottom"
                         outline_and_text_color="var(--ifm-font-color-base)"
                         />
                    </td>
                </tr>);
            })}
        </BrowserOnly></tbody></table>
    );
}