import {h}           from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import {UploadState} from '../../../state/models/Uploads';

export const getStatusIconFor = (status: UploadState): JSXInternal.Element => {
    switch (status) {
        case 'idle':
        case 'paused':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d="M 10 5.25 L 10 44.746094 L 43.570313 25 Z"/>
                </svg>
            );
        case 'running':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d="M 12 8 L 12 42 L 22 42 L 22 8 Z M 28 8 L 28 42 L 38 42 L 38 8 Z"/>
                </svg>
            );
        case 'cancelled':
        case 'errored':
        case 'timeout': {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                    <path
                        d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                </svg>
            );
        }
        case 'finished':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                    <path
                        d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"/>
                </svg>
            );
        case 'peer-cancelled': {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                    <path
                        d="M 15.089844 3 C 10.131844 3 7.3202344 5.7778281 7.2402344 9.7988281 L 7.2402344 10 L 11.617188 10 L 11.617188 9.7988281 C 11.713187 8.0228281 12.941828 6.8769531 14.798828 6.8769531 C 16.639828 6.8769531 17.867188 7.9413594 17.867188 9.4433594 C 17.867188 10.945359 17.237297 11.720844 15.154297 12.964844 C 12.925297 14.272844 12.036094 15.726547 12.246094 18.310547 L 12.271484 19 L 16.558594 19 L 16.558594 18.34375 C 16.558594 16.79375 17.156688 16.000812 19.304688 14.757812 C 21.581688 13.416813 22.759766 11.721828 22.759766 9.2988281 C 22.759766 5.5678281 19.708844 3 15.089844 3 z M 14.507812 22 C 12.864813 22 11.839844 22.953813 11.839844 24.507812 C 11.839844 26.047813 12.865813 27 14.507812 27 C 16.149812 27 17.162109 26.047812 17.162109 24.507812 C 17.162109 22.953813 16.150813 22 14.507812 22 z"/>
                </svg>
            );
        }
    }
};
