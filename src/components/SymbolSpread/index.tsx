import { SPSymbol } from "autumnplot-gl";

import './symbol-spread.css';
import React from "react";

const SYMBOLS: Record<SPSymbol, number> = {
    // Sky cover symbols
    '0/8': 59658, '1/8': 59659, '2/8': 59660, '3/8': 59661, '4/8': 59662, '5/8': 59663, '6/8': 59664, '7/8': 59665, '8/8': 59666,
    'clr': 59658, 'few': 59660, 'sct': 59662, 'bkn': 59664, 'ovc': 59666, 'obsc': 59667,

    // Present weather symbols
    'va': 59810, 'fu': 59810, 'hz': 59811, 'du': 59812, 'bldu': 59814, 'sa': 59814, 'blsa': 59814, 'vcblsa': 59814, 'vcbldu': 59814, 'blpy': 59814,
    'po': 59816, 'vcpo': 59816, 'vcds': 59817, 'vcss': 59817,
    'br': 59818, 'bcbr': 59818, 'bc': 59819, 'mifg': 59820,
    'vcts': 59821, 'virga': 59822, 'vcsh': 59824, 'ts': 59825, 'thdr': 59825, 'vctshz': 59825,
    'tsfzfg': 59825, 'tsbr': 59825, 'tsdz': 59825, 'vctsup': 59825,
    '-tsup': 59825, 'tsup': 59825, '+tsup': 59825,
    'sq': 59826, 'fc': 59827, '+fc': 59827,
    'ds': 59839,'ss': 59839, 'drsa': 59839, 'drdu': 59839, '+ds': 59842, '+ss': 59842,
    'drsn': 59844, '+drsn': 59845, '-blsn': 59846, 'blsn': 59846, '+blsn': 59847, 'vcblsn': 59846,
    'vcfg': 59848, 'bcfg': 59849, 'prfg': 59852, 'fg': 59853, 'fzfg': 59857,
    '-vctsdz': 59859, '-dz': 59859, '-dzbr': 59859, 'vctsdz': 59861, 'dz': 59861, '+vctsdz': 59863, '+dz': 59863,
    '-fzdz': 59864, '-fzdzsn': 59864, 'fzdz': 59865, '+fzdz': 59865, 'fzdzsn': 59865,
    '-dzra': 59866, 'dzra': 59867, '+dzra': 59867, '-ra': 59869, '-rabr': 59869, 'ra': 59871, 'rabr': 59871, 'rafg': 59871, 'vcra': 59871, '+ra': 59873,
    '-fzra': 59874, '-fzrasn': 59874, '-fzrabr': 59874, '-fzrapl': 59874, '-fzrasnpl': 59874, 'tsfzrapl': 59875, '-tsfzra': 59875,
    'fzra': 59875, '+fzra': 59875, 'fzrasn': 59875, 'tsfzra': 59875,
    '-dzsn': 59876, '-rasn': 59876, '-snra': 59876, '-sndz': 59876, 'rasn': 59877, '+rasn': 59877, 'snra': 59877, 'dzsn': 59877, 'sndz': 59877, '+dzsn': 59877, '+sndz': 59877,
    '-sn': 59879, '-snbr': 59879, 'sn': 59881, '+sn': 59883, '-snsg': 59885, 'sg': 59885, '-sg': 59885, 'ic': 59886,
    '-fzdzpl': 59887, '-fzdzplsn': 59887, 'fzdzpl': 59887, '-fzraplsn': 59887, 'fzrapl': 59887, '+fzrapl': 59887,
    '-rapl': 59887, '-rasnpl': 59887, '-raplsn': 59887, '+rapl': 59887, 'rapl': 59887, '-snpl': 59887, 'snpl': 59887,
    '-pl': 59887, 'pl': 59887, '-plsn': 59887, '-plra': 59887, 'plra': 59887, '-pldz': 59887, '+pl': 59887, 'plsn': 59887, 'plup': 59887, '+plsn': 59887,
    '-sh': 59888, '-shra': 59888, 'sh': 59889, 'shra': 59889, '+sh': 59889, '+shra': 59889, '-shrasn': 59891, '-shsnra': 59891, '+shrabr': 59892,
    'shrasn': 59892, '+shrasn': 59892, 'shsnra': 59892, '+shsnra': 59892, '-shsn': 59893, 'shsn': 59894, '+shsn': 59894,
    '-gs': 59895, '-shgs': 59895, 'fzraplgs': 59896, '-sngs': 59896, 'gsplsn': 59896, 'gspl': 59896, 'plgssn': 59896, 'gs': 59896, 'shgs': 59896, '+gs': 59896, '+shgs': 59896,
    '-gr': 59897, '-shgr': 59897, '-sngr': 59898, 'gr': 59898, 'shgr': 59898, '+gr': 59898, '+shgr': 59898,
    '-tsrasn': 59907, 'tsrasn': 59907, '-tssnra': 59907, 'tssnra': 59907, '-vctsra': 59908, '-tsra': 59908, 'tsra': 59908, '-tsdz': 59908, 'vctsra': 59908,
    'tspl': 59909, '-tssn': 59909, '-tspl': 59909, 'tssn': 59909, '-vctssn': 59909, 'vctssn': 59909, 'tsplsn': 59909, 'tssnpl': 59909, '-tssnpl': 59909, '-tsragr': 59910,
    'tsrags': 59910, 'tsragr': 59910, 'tsgs': 59910, 'tsgr': 59910,
    '+tsfzrapl': 59911, '+vctsra': 59912, '+tsra': 59912, '+tsfzra': 59912, '+tssn': 59913, '+tspl': 59913, '+tsplsn': 59913, '+vctssn': 59913,
    'tssa': 59914, 'tsds': 59914, 'tsdu': 59914, '+tsgs': 59915, '+tsgr': 59915, '+tsrags': 59915, '+tsragr': 59915, 'in': 59750,
    '-up': 59750, 'up': 59750, '+up': 59751, '-fzup': 59756, 'fzup': 59756, '+fzup': 59757,
}

type SymbolSpreadProps = {
    default_expand?: boolean;
}

export function SymbolSpread(props: SymbolSpreadProps) : React.ReactNode {
    const default_expand = props.default_expand === undefined ? false : props.default_expand;

    const [viewState, setViewState] = React.useState({
        expanded: default_expand
    });

    const symbols_collected: Record<number, SPSymbol[]> = {};

    Object.entries(SYMBOLS).forEach(([symbol, symbol_num]) => {
        if (!(symbol_num in symbols_collected)) {
            symbols_collected[symbol_num] = []
        }
        symbols_collected[symbol_num].push(symbol as SPSymbol);
    });

    const expand_cls = viewState.expanded ? 'symbol-spread-container-expanded' : '';

    return (<div className={`symbol-spread-container ${expand_cls}`}>
        <div className="symbol-spread-container-toggle" onClick={() => setViewState({expanded: !viewState.expanded})}>
            {viewState.expanded ? '\u25b2 Collapse \u25b2' : '\u25bc Expand \u25bc'}
        </div>
        <table className='symbol-spread'><tbody>
        <tr><th>Symbol</th><th>Possible Codes</th></tr>
        {Object.entries(symbols_collected).map(([symbol_num, symbols]) => {
            return (
                <tr key={symbol_num}>
                    <td className="wx-symbol">{String.fromCharCode(symbol_num as unknown as number)}</td>
                    <td>{symbols.map((sym, isym) => {
                        const end = isym == symbols.length - 1 ? '' : ', ';
                        return <span><code key={sym}>'{sym}'</code>{end}</span>
                    })}</td>
                </tr>
            );
        })}
        </tbody></table>
    </div>);
}