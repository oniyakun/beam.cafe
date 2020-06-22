import {DropDown}         from '@components/DropDown';
import {settings}         from '@state/index';
import {UploadState}      from '@state/models/Upload';
import {UploadExtensions} from '@state/models/UploadExtensions';
import {bind}             from '@utils/preact-utils';
import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import styles             from './UploadStateNotification.module.scss';

@observer
export class UploadStateNotification extends Component {
    private static namings = UploadExtensions.availableNotifications;

    get onUploadStateChange() {
        return settings.notifications.onUploadStateChange;
    }

    get availableSettings() {
        return UploadStateNotification.namings
            .filter(v => !this.onUploadStateChange.includes(v[0]));
    }

    @bind
    replaceState(oldIndex: number) {
        return (key: string | number) => {
            this.onUploadStateChange
                .splice(oldIndex, 1, key as UploadState);
        };
    }

    @bind
    watchState(key: string | number) {
        this.onUploadStateChange.push(key as UploadState);
    }

    @bind
    unwatchState(key: string) {
        return () => {
            settings.notifications.onUploadStateChange =
                this.onUploadStateChange.filter(
                    value => value !== key
                );
        };
    }

    render() {
        const {availableSettings, onUploadStateChange} = this;
        const {namings} = UploadStateNotification;

        const buttons = [];
        for (let i = 0; i < onUploadStateChange.length; i++) {
            const key = onUploadStateChange[i];
            const name = namings.find(v => v[0] === key)?.[1];

            if (name) {
                buttons.push(
                    <div className={styles.container}>
                        <DropDown items={[
                            [key, name],
                            ...availableSettings
                        ]} onSelect={this.replaceState(i)} aria-label={`当上传 ${name} 时更新上传状态通知`}/>
                        <button onClick={this.unwatchState(key)}
                                aria-label={`当上传 ${name} 时移除通知`}>
                            <bc-icon name="delete"/>
                        </button>
                    </div>
                );
            }
        }

        if (availableSettings.length) {
            buttons.push(
                <DropDown items={[
                    ['add', '添加另一个通知...'],
                    ...availableSettings
                ]} onSelect={this.watchState}/>
            );
        }

        return buttons;
    }
}
