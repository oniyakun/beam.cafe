import {Switch}                 from '@components/Switch';
import {Toast}                  from '@overlays/Toast';
import {settings}               from '@state/index';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';
import styles                   from './Appearance.module.scss';

const colors: Array<[number, number, number]> = [
    [50, 92, 45],
    [90, 86, 42],
    [160, 79, 45],
    [220, 94, 61],
    [260, 94, 61],
    [300, 79, 54],
    [360, 75, 56]
];

export const Appearance: FunctionalComponent = observer(() => {
    const themeColorMetaElements: Array<HTMLMetaElement> = Array.from(document.querySelectorAll('meta[data-meta="theme-color"]'));
    const updatePageTheme = (hue: number, saturation: number, lightness: number) => {
        for (const el of themeColorMetaElements) {
            el.content = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    };

    const toggleHighContrast = (newValue: boolean) => {
        document.body.classList[newValue ? 'add' : 'remove']('high-contrast');
        settings.highContrast = newValue;
    };

    const generateThemeColors = (hue: number, saturation: number, lightness: number) => {
        return [
            `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            `hsl(${hue}, ${saturation - 12}%, ${lightness - 6}%)`,
            `hsla(${hue}, ${saturation - 12}%, ${lightness - 6}%, 0.42)`
        ];
    };

    const applyCustomColor = (hue: number, saturation: number, lightness: number) => {
        if (settings.highContrast) {
            Toast.instance.show({
                text: 'Turn of high contrast to use custom colors!',
                type: 'success'
            });
        } else {
            settings.themeColor = [hue, saturation, lightness];
        }
    };

    const bodyStyle = document.body.style;
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        bodyStyle.removeProperty('--c-primary');
        bodyStyle.removeProperty('--c-primary-accent');
        bodyStyle.removeProperty('--c-primary-focus');
        updatePageTheme(...colors[3]); // The fourth value is the original theme color
    } else {
        const [color, accent, focus] = generateThemeColors(...settings.themeColor);
        bodyStyle.setProperty('--c-primary', color);
        bodyStyle.setProperty('--c-primary-accent', accent);
        bodyStyle.setProperty('--c-primary-focus', focus);
        updatePageTheme(...settings.themeColor);
    }

    const customColorButtons = [];
    const currentThemeColor = bodyStyle.getPropertyValue('--c-primary');
    for (const [hue, cs, cl] of colors) {
        const [color, accent, focus] = generateThemeColors(hue, cs, cl);

        customColorButtons.push(
            <button style={`--c-color:${color};--c-accent:${accent};--c-focus:${focus};`}
                    data-active={color === currentThemeColor}
                    data-hidden={settings.highContrast}
                    onClick={() => applyCustomColor(hue, cs, cl)}/>
        );
    }

    return (
        <div className={baseStyles.section}>
            <header>
                <bc-icon name="palette"/>
                <h1>外观</h1>
                <span>选择你喜欢的颜色</span>

                <div className={styles.colors}>
                    {customColorButtons}
                </div>
            </header>

            <section>
                <header>
                    <bc-icon name="contrast"/>
                    <h3>高对比度</h3>
                    <Switch state={settings.highContrast}
                            onChange={toggleHighContrast}/>
                </header>

                <article>
                    增加UI元件之间的对比度
                </article>
            </section>

            <section>
                <header>
                    <bc-icon name="services"/>
                    <h3>自动处理重复的文件名</h3>
                    <Switch state={settings.processDuplicateFilenames}
                            onChange={v => settings.processDuplicateFilenames = v}/>
                </header>

                <article>
                    如果你添加的文件名重复出现，则将自动添加一个后缀。
                    如果你关闭此选项，将跳过这些文件。
                </article>
            </section>
        </div>
    );
});
