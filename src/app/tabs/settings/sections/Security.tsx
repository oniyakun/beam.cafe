import {Switch}                 from '@components/Switch';
import {settings}               from '@state/index';
import {uids}                   from '@utils/uid';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';

export const Security: FunctionalComponent = observer(() => {
    const [label1, label2, label3] = uids(3);

    return (
        <div className={baseStyles.section}>
            <header>
                <bc-icon name="shield"/>
                <h1>安全设置</h1>
                <span>所有隐私设置都在这里</span>
            </header>

            <section>
                <header>
                    <bc-icon name="resume"/>
                    <h3>自动暂停</h3>
                    <Switch state={settings.autoPause}
                            onChange={v => settings.autoPause = v}
                            aria-describedby={label1}/>
                </header>

                <article id={label1}>
                    所有下载请求都将经过你的同意后才会开始。
                </article>
            </section>

            <section>
                <header>
                    <bc-icon name="ninja"/>
                    <h3>严格会话</h3>
                    <Switch state={settings.remote.strictSession}
                            onChange={v => settings.remote.strictSession = v}
                            aria-describedby={label2}/>
                </header>

                <article id={label2}>
                    通常情况下，所有的密钥和有关您的文件的信息将保留至少15分钟后才会断开连接以稳定的上传。如果你的以太网连接是稳定的并想关闭此页面后立即停止上传，请打开这个选项
                </article>
            </section>

            <section>
                <header>
                    <bc-icon name="recycle"/>
                    <h3>可重复使用的分享链接</h3>
                    <Switch state={settings.remote.reusableDownloadKeys}
                            onChange={v => settings.remote.reusableDownloadKeys = v}
                            aria-describedby={label3}/>
                </header>

                <article id={label3}>
                    关闭这个选项会让所有分享链接变成一次性链接。当链接被使用后，将自动生成新的分享链接。
                </article>
            </section>

            <section>
                <header>
                    <bc-icon name="online"/>
                    <h3>流式传输</h3>
                    <Switch state={settings.remote.allowStreaming}
                            onChange={v => settings.remote.allowStreaming = v}
                            aria-describedby={label3}/>
                </header>

                <article id={label3}>
                    流式传输允许对方通过对等网络在线串流你的视频/音频等内容，关闭这个选项会让对方只能先下载后观看。
                </article>
            </section>
        </div>
    );
});
