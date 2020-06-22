import {UploadStream, UploadStreamState}    from '@state/models/UploadStream';
import {h}                                  from 'preact';
import {JSXInternal}                        from 'preact/src/jsx';
import prettyBytes                          from 'pretty-bytes';
import {pushNotification, showNotification} from '..';
import {Upload, UploadState}                from './Upload';

export const UploadExtensions = {
    availableNotifications: [
        ['running', '已开始'],
        ['awaiting-approval', '等待批准'],
        ['peer-cancelled', '被取消'],
        ['finished', '已完成'],
        ['errored', '失败']
    ] as Array<[UploadState, string]>,

    notifyFor(upload: Upload): boolean | Promise<void> | void {
        const {state, listedFile} = upload;

        switch (state) {
            case 'running':
                return pushNotification({
                    title: '你开始上传文件了！',
                    body: `文件 "${listedFile.name}" 已开始上传`
                });
            case 'awaiting-approval':
                return showNotification({
                    title: '有人请求下载文件',
                    body: `点击确认 "${listedFile.name}" 文件的下载`
                }).then(data => {
                    if (data === 'click') {
                        upload.update('running');
                    } else if (data === 'close') {
                        upload.update('cancelled');
                    }
                });
            case 'peer-cancelled':
                return pushNotification({
                    title: '上传已被你的主机取消',
                    body: `"${listedFile.name}" 的下载被远程服务器取消了，可能是网络问题`
                });
            case 'finished':
                return pushNotification({
                    title: '上传完成',
                    body: `"${listedFile.name}" 已成功上传`
                });
            case 'errored':
                return pushNotification({
                    title: '上传失败.',
                    body: `"${listedFile.name}" 上传失败，请检查下网络并重新试试`
                });
        }
    },

    getStatusMessageFor(upload: Upload | UploadStream): string {
        const {state, progress} = upload;

        if (upload instanceof Upload) {

            // Round progress to two decimal places
            const percentage = Math.round(progress * 10000) / 100;
            const text = `${percentage.toFixed(2)}%`;

            switch (state) {
                case 'idle':
                    return '等待中...';
                case 'paused':
                    return `${text} - 已暂停`;
                case 'running':
                    return `${text} - ${prettyBytes(upload.currentSpeed, {bits: true})}/s`;
                case 'removed':
                    return '文件已删除';
                case 'cancelled':
                    return '被你取消';
                case 'connection-lost':
                    return '到服务器的连接失败';
                case 'peer-cancelled':
                    return '被远程服务器取消';
                case 'errored':
                    return '出现错误';
                case 'finished':
                    return '完成';
                case 'awaiting-approval':
                    return '自动暂停已激活，按一下 开始上传 以开始'; // BRR BRR I'm the terminator
            }
        } else {
            switch (state as UploadStreamState) {
                case 'idle':
                case 'awaiting-approval':
                    return '自动暂停已激活，按一下 开始上传 以开始';
                case 'running':
                    return progress ? `${prettyBytes(progress)} 已传输` : '等待流式传输...';
                case 'removed':
                    return progress ? `文件已移除 (${prettyBytes(progress)} 已传输)` : '文件已被移除';
                case 'paused':
                    return progress ? `流式传输已暂停 (${prettyBytes(progress)} 已传输)` : '流式传输已暂停';
                case 'connection-lost':
                    return progress ? `连接到服务器失败 (${prettyBytes(progress)} 已传输)` : '连接到服务器失败';
                case 'peer-cancelled':
                    return progress ? `被远程服务器中断 (${prettyBytes(progress)} 已传输)` : '被远程服务器中断';
                case 'cancelled':
                    return progress ? `流式传输已取消 (${prettyBytes(progress)} 已传输)` : '流式传输已取消';
            }
        }
    },

    getStatusIconFor(status: UploadState): JSXInternal.Element {
        switch (status) {
            case 'idle':
            case 'paused':
                return <bc-icon name="play"/>;
            case 'running':
                return <bc-icon name="pause"/>;
            case 'removed':
            case 'cancelled':
            case 'errored':
                return <bc-icon name="exclamation-mark"/>;
            case 'finished':
                return <bc-icon name="ok"/>;
            case 'peer-cancelled':
                return <bc-icon name="broken-link"/>;
            case 'connection-lost':
                return <bc-icon name="cloud-cross"/>;
            case 'awaiting-approval':
                return <bc-icon name="thumbs-up"/>;
        }
    }
};
