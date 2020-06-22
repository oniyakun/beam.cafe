import {Checkbox}        from '@components/Checkbox';
import {ContextMenu}     from '@components/ContextMenu';
import {DialogBox}       from '@overlays/DialogBox';
import {Toast}           from '@overlays/Toast';
import {files, uploads}  from '@state/index';
import {ListedFile}      from '@state/models/ListedFile';
import {copyToClipboard} from '@utils/copy-to-clipboard';
import {bind, cn}        from '@utils/preact-utils';
import {observer}        from 'mobx-react';
import {Component, h}    from 'preact';
import prettyBytes       from 'pretty-bytes';
import {isMobile}        from '../../browserenv';
import styles            from './FileItem.module.scss';
import {FileStatus}      from './FileStatus';

type Props = {
    item: ListedFile;
    label: string;
    selected: boolean;
    onSelect: (item: ListedFile, ev: MouseEvent) => void;
};

@observer
export class FileItem extends Component<Props> {

    @bind
    share() {
        const {id, name} = this.props.item;
        const toast = Toast.instance;
        const link = `${env.HTTPS_ENDPOINT}/d/${id}`;

        /**
         * Check if share-api is available, only for mobile devices - it sucks on
         * desktop browsers (just looking at safari) which doesn't even give you the ability
         * to copy s*** to the god damn clipboard making this "feature" completely useless
         * and unusable.
         */
        if (navigator.share && isMobile) {
            navigator.share({
                title: name,
                text: `下载 ${name}`,
                url: link
            }).then(() => null).then(() => null);
        } else {
            copyToClipboard(link).then(() => {
                toast.show('链接已复制到剪贴板！');
            }).catch(() => toast.show({
                text: '复制失败 :(',
                type: 'error'
            }));
        }
    }

    @bind
    refresh() {
        files.requestRefreshment(this.props.item);
    }

    @bind
    remove() {
        const {item} = this.props;

        if (item) {
            const relatedUploads = uploads.listedUploads.filter(
                v => v.listedFile === item && v.simpleState !== 'done'
            ).length;

            // Tell the user that uploads are about to get cancelled
            if (relatedUploads > 0) {
                DialogBox.instance.open({
                    icon: 'exclamation-mark',
                    title: '等会！你真的要这么做吗？',
                    description: relatedUploads > 1 ?
                        `这里有 ${relatedUploads} 个连接到这个文件，继续吗？` :
                        '这个文件目前正在上传中，继续吗?',
                    buttons: [
                        {
                            type: 'success',
                            text: '算了'
                        },
                        {
                            type: 'error',
                            text: '移除'
                        }
                    ]
                }).then(value => {
                    if (value === 1) {
                        files.remove(item);
                    }
                });
            } else {
                files.remove(item);
            }
        }
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, label, selected} = this.props;
        const fn = item.name;
        const sn = item.serializedName;

        return (
            <div className={styles.fileItem}
                 data-state={item.status}
                 role="listitem">

                {!isMobile && <Checkbox checked={selected}
                                        className={styles.checkBox}
                                        onChange={this.toggleSelect}
                                        aria-label="Select file"/>}

                <FileStatus status={item.status} text={label}/>

                <p className={cn(styles.itemText, styles.fileName)}>
                    <span>{fn}</span>
                    {
                        sn && sn !== fn ?
                            <span className={styles.serializedName}>- {item.serializedName}</span> :
                            ''
                    }
                </p>

                <p className={cn(styles.itemText, styles.alignRight)}>
                    {prettyBytes(item.size)}
                </p>

                {isMobile ? (
                    <ContextMenu className={styles.menuButton}
                                 button={<bc-icon name="more" className={styles.menuButton}/>}
                                 content={[{
                                     id: 'refresh',
                                     icon: 'sync',
                                     text: '重置链接',
                                     onClick: this.refresh
                                 }, {
                                     id: 'share',
                                     icon: navigator.share && isMobile ? 'share' : 'copy',
                                     text: navigator.share && isMobile ? 'Share' : '复制链接',
                                     onClick: this.share
                                 }, {
                                     id: 'remove',
                                     icon: 'trash',
                                     text: '移除文件',
                                     onClick: this.remove
                                 }]}/>
                ) : (
                    <div className={styles.actionsBox}>
                        <button className={styles.refreshBtn}
                                onClick={this.refresh}>
                            <bc-tooltip content="刷新分享链接"/>
                            <bc-icon name="sync"/>
                        </button>

                        <button className={styles.shareBtn}
                                onClick={this.share}>
                            <bc-tooltip content="复制链接到剪贴板"/>
                            <bc-icon name="copy"/>
                        </button>

                        <button className={styles.removeBtn}
                                onClick={this.remove}>
                            <bc-tooltip content="移除这个文件"/>
                            <bc-icon name="trash"/>
                        </button>
                    </div>
                )}

                <p className={styles.copyLinkOverlay}
                   onClick={this.share}>
                    <span>复制链接</span>
                </p>
            </div>
        );
    }
}
