import {Toast}                                 from '@overlays/Toast';
import {files, resetSettings, socket, uploads} from '@state/index';
import {bind, cn}                              from '@utils/preact-utils';
import {uids}                                  from '@utils/uid';
import {observer}                              from 'mobx-react';
import {Component, h}                          from 'preact';
import baseStyles                              from './_base.module.scss';

@observer
export class DangerZone extends Component {

    @bind
    resetSettings() {
        resetSettings();
        Toast.instance.show('Settings restored!');
    }

    @bind
    resetKeys() {

        // Cancel downloads
        uploads.massAction('cancel');

        // Mark all files as pending
        files.resetFiles();

        if (socket.connected) {
            socket.sendMessage('refresh-all-files');
            Toast.instance.show('Keys refreshed!');
        } else {
            Toast.instance.show({
                text: 'Failed to reset keys.',
                body: 'Try again later',
                type: 'error'
            });
        }
    }

    render() {
        const [label1, label2] = uids(2);

        return (
            <div className={cn(baseStyles.section)}>
                <header>
                    <bc-icon name="electricity"/>
                    <h1>危险区域！</h1>
                    <span>请不要更改以下选项，除非你知道自己在做什么</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="refresh-shield"/>
                        <h3>重置分享链接</h3>
                        <button onClick={this.resetKeys}
                                className={cn(baseStyles.headerBtn, baseStyles.danger)}
                                disabled={files.isEmpty}
                                aria-describedby={label1}>重置
                        </button>
                    </header>

                    <article id={label1}>
                        如果发现异常情况例如可疑下载，你可以为所有文件生成新的分享链接。
                        所有正在进行的下载将被中断，您以前的分享链接将失效。
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="settings"/>
                        <h3>重置设定值</h3>
                        <button className={cn(baseStyles.headerBtn, baseStyles.danger)}
                                onClick={this.resetSettings}
                                aria-describedby={label2}>Reset
                        </button>
                    </header>

                    <article id={label2}>
                        这会把你的所有设定恢复到默认值
                    </article>
                </section>
            </div>
        );
    }
}
