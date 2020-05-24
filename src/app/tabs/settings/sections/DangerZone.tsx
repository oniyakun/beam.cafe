import {Toast}                            from '@overlays/Toast';
import {files, settings, socket, uploads} from '@state/index';
import {bind, cn}                         from '@utils/preact-utils';
import {uIds}                             from '@utils/uid';
import {Component, h}                     from 'preact';
import baseStyles                         from './_base.module.scss';

export class DangerZone extends Component {

    @bind
    resetSettings() {
        settings.reset();
        Toast.instance.show('Settings restored!');
    }

    @bind
    resetKeys() {

        // Cancel downloads
        uploads.massAction('cancel');

        // Request a new key-set
        socket.request('reset-keys').then(() => {
            Toast.instance.show('Keys refreshed!');
        }).catch(() => {
            Toast.instance.show({
                text: 'Failed to reset keys.',
                type: 'error'
            });
        });
    }

    render() {
        const [label1, label2] = uIds(2);

        return (
            <div className={cn(baseStyles.section)}>
                <header>
                    <bc-icon name="electricity"/>
                    <h1>Danger Zone</h1>
                    <span>Usage of the following options with caution!</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="refresh-shield"/>
                        <h3>Refresh Keys</h3>
                        <button onClick={this.resetKeys}
                                className={cn(baseStyles.headerBtn, baseStyles.danger)}
                                disabled={files.isEmpty}
                                aria-describedby={label1}>Refresh
                        </button>
                    </header>

                    <article id={label1}>
                        In case you discover anomalies such as suspicious downloads you can
                        generate new keys for all your files. All active downloads will be cancelled
                        and your previous download-links will be invalidated.
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="settings"/>
                        <h3>Reset Settings</h3>
                        <button className={cn(baseStyles.headerBtn, baseStyles.danger)}
                                onClick={this.resetSettings}
                                aria-describedby={label2}>Reset
                        </button>
                    </header>

                    <article id={label2}>
                        This will restore the default-settings, overriding the current ones.
                    </article>
                </section>
            </div>
        );
    }
}
