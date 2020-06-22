import {DialogBox}              from '@overlays/DialogBox';
import {files}                  from '@state/stores/Files';
import {uploads}                from '@state/stores/Uploads';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import {isMobile}               from '../../browserenv';
import styles                   from './ActionBar.module.scss';

export const ActionBar: FunctionalComponent = observer(() => {
    const preConfirmAction = (cb: () => void, confirm = 'Okay', cancel = 'Cancel') => {
        const relatedUploads = !!uploads.listedUploads.find(
            v => v.simpleState !== 'done' && files.isSelected(v.listedFile)
        );

        // Tell the user that uploads are about to get cancelled
        if (relatedUploads) {
            DialogBox.instance.open({
                icon: 'exclamation-mark',
                title: '等会！你真的要这么做吗？',
                description: '这会导致你上传的所有文件和正在传输的文件被取消，确定吗？',
                buttons: [
                    {
                        type: 'success',
                        text: cancel
                    },
                    {
                        type: 'error',
                        text: confirm
                    }
                ]
            }).then(value => value === 1 && cb());
        } else {
            cb();
        }
    };

    const removeSelectedFiles = () => preConfirmAction(() => {
        files.remove(...files.selectedItems);
    }, '移除');

    const refreshSelectedFiles = () => preConfirmAction(() => {
        files.requestRefreshment(...files.selectedItems);
    }, '刷新');

    const {selectedItems, selectedAmount} = files;
    const loading = !!selectedItems.find(value => value.status !== 'ready');

    return (
        <div className={styles.actionBar}>
            <button onClick={() => files.openDialog()}
                    className={styles.addBtn}
                    aria-label="Add files manually">
                <bc-icon name="plus"/>
                <span>添加文件</span>
            </button>

            {selectedAmount ?
                <button onClick={refreshSelectedFiles}
                        className={styles.refreshBtn}
                        aria-label="Refresh Access Key"
                        disabled={loading}>
                    <bc-icon name="reset"/>
                    <span>刷新 {selectedAmount > 1 ? `${selectedAmount} keys` : 'Key'}</span>
                </button> : ''
            }

            {!isMobile && selectedAmount ?
                <div className={styles.removeBtn}>
                    <button onClick={removeSelectedFiles}
                            aria-label="Remove files"
                            disabled={loading}>
                        <bc-icon name="trash"/>
                        <span>移除 {selectedAmount > 1 ? `${selectedAmount} files` : 'File'}</span>
                    </button>

                    <button onClick={() => files.clearSelection()}
                            aria-label="Clear selection"
                            disabled={loading}>
                        <bc-icon name="delete"/>
                        <bc-tooltip content="Clear Selection"/>
                    </button>
                </div> : ''
            }
        </div>
    );
});
