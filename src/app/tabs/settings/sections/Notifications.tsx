import {Switch}                     from '@components/Switch';
import {Toast}                      from '@overlays/Toast';
import {pushNotification, settings} from '@state/index';
import {cn}                         from '@utils/preact-utils';
import {observer}                   from 'mobx-react';
import {FunctionalComponent, h}     from 'preact';
import baseStyles                   from './_base.module.scss';
import styles                       from './Notifications.module.scss';
import {UploadStateNotification}    from './UploadStateNotification';

export const Notifications: FunctionalComponent = observer(() => {
    const {notifications} = settings;

    const toggle = () => {

        const {turnedOn} = notifications;

        if (turnedOn === true) {
            notifications.turnedOn = false;
        } else if (turnedOn === false) {
            switch (Notification.permission) {
                case 'default': {
                    notifications.turnedOn = 'intermediate';

                    /**
                     * Request permissions, safari again is really slow in
                     * catching up with other browser so we have to provide an callback.
                     */
                    const resolve = (status: string) => notifications.turnedOn = status === 'granted';
                    const request = Notification.requestPermission(resolve);

                    if (request instanceof Promise) {
                        request.then(resolve);
                    }

                    break;
                }
                case 'denied': {
                    notifications.turnedOn = false;

                    Toast.instance.show({
                        text: '通知被你的浏览器禁用了',
                        body: '检查浏览器的站点设置以启用此站点的通知。',
                        type: 'warning'
                    });
                    break;
                }
                case 'granted': {
                    notifications.turnedOn = true;
                    break;
                }
            }
        }
    };

    const testNotifications = () => {
        const success = pushNotification({
            title: 'Hello World!',
            body: '现在你可以去分享你的文件啦 :)'
        });

        if (!success) {
            if (notifications.hideIfAppIsVisible) {
                Toast.instance.show({
                    text: '通知在此页面开启的情况下已被自动隐藏',
                    body: '要现在就查看通知，请关闭下面的 在页面开启情况下隐藏通知 功能',
                    type: 'warning'
                });
            } else {
                Toast.instance.show({
                    text: '通知测试失败',
                    body: '重启浏览器试试',
                    type: 'error'
                });
            }
        }
    };

    return (
        <div className={cn(baseStyles.section, styles.notifications, {
            [styles.enabled]: notifications.turnedOn === true
        })}>

            <section className={baseStyles.standalone}>
                <header>
                    <bc-icon name="notification"/>
                    <h3>打开通知</h3>
                    <Switch state={notifications.turnedOn}
                            onChange={toggle}
                            aria-describedby="Turn on notifications"/>
                </header>
            </section>

            <section className={cn(styles.optionsHeader, baseStyles.borderless)}>
                <h3>自定义通知</h3>

                <button onClick={testNotifications}
                        aria-label="Show test Notification">
                    <bc-tooltip content="测试通知功能"/>
                    <bc-icon name="notification-color"/>
                </button>
            </section>

            <section className={cn(styles.options, baseStyles.borderless)}>
                <div>
                    <h3>在页面开启情况下隐藏通知</h3>
                    <Switch state={notifications.hideIfAppIsVisible}
                            onChange={v => notifications.hideIfAppIsVisible = v}
                            aria-label="Hide notifications if app is visible"/>
                </div>

                <div>
                    <h3>连接丢失/重建连接时通知</h3>
                    <Switch state={notifications.onConnectionChange}
                            onChange={v => notifications.onConnectionChange = v}
                            aria-label="Connection lost / re-established"/>
                </div>

                <div>
                    <h3>有更新可用时通知</h3>
                    <Switch state={notifications.onUpdateAvailable}
                            onChange={v => notifications.onUpdateAvailable = v}
                            aria-label="Update available"/>
                </div>
            </section>

            <section className={cn(styles.optionsHeader, baseStyles.borderless)} aria-rule="banner">
                <h3>在上传时提醒我...</h3>
            </section>

            <section className={cn(styles.options, baseStyles.borderless)}>
                <UploadStateNotification/>
            </section>
        </div>
    );
});
