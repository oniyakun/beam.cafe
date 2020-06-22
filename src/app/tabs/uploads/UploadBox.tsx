import {ListedFile}          from '@state/models/ListedFile';
import {UploadLike}          from '@state/models/types';
import {Upload}              from '@state/models/Upload';
import {UploadStream}        from '@state/models/UploadStream';
import {MassAction, uploads} from '@state/stores/Uploads';
import {bind}                from '@utils/preact-utils';
import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import styles                from './UploadBox.module.scss';
import {UploadItem}          from './UploadItem';
import {UploadStreamItem}    from './UploadStreamItem';

type Props = {
    uploadItems: Array<UploadLike>;
    listedFile: ListedFile;
};

@observer
export class UploadBox extends Component<Props> {

    @bind
    massAction(ups: Array<UploadLike>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
    }

    @bind
    selectItem(item: UploadLike, ev: MouseEvent) {
        uploads.selectViaMouseEvent(ev, item, this.props.uploadItems);
    }

    render() {
        const {uploadItems, listedFile} = this.props;
        const {name} = listedFile;
        const massActions = uploads.getAvailableMassActions(uploadItems);

        return (
            <div className={styles.uploadBox}
                 role="listbox"
                 aria-label={`${name} 打包上传`}>

                <div className={styles.header}>
                    <div className={styles.fileName}>
                        <h3>{name}</h3>
                    </div>

                    <div className={styles.controls}>
                        <button disabled={!massActions.has('resume')}
                                onClick={this.massAction(uploadItems, 'resume')}
                                aria-label={`继续 ${name} 的上传`}>
                            <bc-tooltip content="继续所有上传"/>
                            <bc-icon name="play"/>
                        </button>

                        <button disabled={!massActions.has('pause')}
                                onClick={this.massAction(uploadItems, 'pause')}
                                aria-label={`暂停 ${name} 的上传`}>
                            <bc-tooltip content="暂停所有上传"/>
                            <bc-icon name="pause"/>
                        </button>

                        <button disabled={!massActions.has('cancel')}
                                onClick={this.massAction(uploadItems, 'cancel')}
                                aria-label={`取消 ${name} 的上传`}>
                            <bc-tooltip content="取消所有上传"/>
                            <bc-icon name="delete"/>
                        </button>

                        {massActions.has('remove') ?
                            <button onClick={this.massAction(uploadItems, 'remove')}
                                    aria-label={`移除 ${name} 的上传`}>
                                <bc-tooltip content="移除所有上传"/>
                                <bc-icon name="trash"/>
                            </button> : ''}
                    </div>
                </div>

                <div className={styles.uploadList}>
                    {uploadItems.map(item =>
                        item instanceof Upload ?
                            <UploadItem key={item.id}
                                        item={item}
                                        selected={uploads.isSelected(item)}
                                        onSelect={this.selectItem}/> :
                            <UploadStreamItem key={item.id}
                                              item={item as UploadStream}
                                              selected={uploads.isSelected(item)}
                                              onSelect={this.selectItem}/>
                    )}
                </div>
            </div>
        );
    }
}
