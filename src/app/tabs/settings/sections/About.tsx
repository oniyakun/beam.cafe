import {cn}                     from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';
import styles                   from './About.module.scss';

export const About: FunctionalComponent = () => (
    <div className={cn(baseStyles.section, styles.about)}
         role="comment">
        <header>
            <bc-icon name="help"/>
            <h1>关于</h1>
            <span>关于这个项目和作者</span>
        </header>

        <section>
            <ul>
                <li>作者: <b>Simon Reinisch</b></li>
                <li>项目: <a href="https://github.com/dot-cafe/beam.cafe"
                                target="_blank"
                                rel="noopener noreferrer">Repository on GitHub</a></li>
                <li>证书: <b>MIT</b></li>
                <li>版本: <b>{env.VERSION}</b></li>
                <li>构建: <b>{new Date(env.BUILD_DATE).toUTCString()}</b></li>
                <li>汉化: <a href="https://github.com/oniyakun/beam.cafe" target="_blank" rel="noopener noreferrer">By Oniya on Github</a></li>
            </ul>
        </section>

        <section>
            <p>感谢 <a href="https://icons8.com/"
                                 target="_blank"
                                 rel="noopener noreferrer">Icons8</a> 提供的标签</p>
        </section>
    </div>
);
