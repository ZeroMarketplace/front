import {defineStore} from "pinia";

export const useMessengerStore = defineStore('messenger', {
    state() {
        return {
            conversations: {},
            messages     : {},
            users        : {},
            uploads      : {},
            downloads    : {},
        }
    },
    actions: {
        addUser(user) {

            if (!this.users[user._id])
                this.users[user._id] = {};

            this.users[user._id]['_id']       = user._id;
            this.users[user._id]['firstName'] = user.name.first;
            this.users[user._id]['lastName']  = user.name.last;
            this.users[user._id]['avatars']   = user.avatars;
            this.users[user._id]['color']     = user.color;

            // add online field
            if (!this.users[user._id]['online']) {
                this.users[user._id]['online'] = false;
            }

            // add status field
            if (!this.users[user._id]['status']) {
                this.users[user._id]['status'] = {
                    operation    : '', // isTyping - sendFile - sendVoice
                    _conversation: '' // conversation _id
                };
            }

            // add lastSeen field
            if (!this.users[user._id]['lastSeen']) {
                this.users[user._id]['lastSeen'] = null;
            }
        },
        setUserOnline(data) {
            if (!this.users[data._user]) {
                this.users[data._user] = {
                    lastSeen: data.lastSeen,
                    online  : data.status
                };
            } else {
                // set user last seen
                if (data.lastSeen) {
                    this.users[data._user]['lastSeen'] = data.lastSeen;
                }

                // set user online status
                this.users[data._user]['online'] = data.status;
            }
        },
        addConversation(conversation) {

            if (!this.conversations[conversation._id])
                this.conversations[conversation._id] = {};

            this.conversations[conversation._id]['_id']         = conversation._id;
            this.conversations[conversation._id]['type']        = conversation.type;
            this.conversations[conversation._id]['members']     = conversation.members;
            this.conversations[conversation._id]['unreadCount'] = conversation.unreadCount;
            this.conversations[conversation._id]['updatedAt']   = conversation.updatedAt;

            // create messages field if not exists
            if (!this.messages[conversation._id]) {
                this.messages[conversation._id] = {};
            }

            // switch for conversation type and set special fields

        },
        deleteConversation(_conversation) {
            // delete conversation
            if (this.conversations[_conversation]) {
                delete this.conversations[_conversation];

                // delete the messages
                if (this.messages[_conversation]) {
                    delete this.messages[_conversation];
                }
            }
        },
        clearConversations() {
            this.conversations = {};
        },
        addMessage(message) {

            if (!this.conversations[message._conversation])
                return;

            // create message array
            if (!this.messages[message._conversation][message._id])
                this.messages[message._conversation][message._id] = {};

            this.messages[message._conversation][message._id]['_id']           = message._id;
            this.messages[message._conversation][message._id]['type']          = message.type;
            this.messages[message._conversation][message._id]['_sender']       = message._sender;
            this.messages[message._conversation][message._id]['createdAt']     = message.createdAt;
            this.messages[message._conversation][message._id]['updatedAt']     = message.updatedAt;
            this.messages[message._conversation][message._id]['_conversation'] = message._conversation;

            // _readBy
            if (this.messages[message._conversation][message._id]['_readBy']) {
                message._readBy.forEach((userId) => {
                    this.readMessage({
                        _id          : message._id,
                        _conversation: message._conversation
                    }, userId)
                });
            } else {
                this.messages[message._conversation][message._id]['_readBy'] = message._readBy;
            }

            // check isEdited
            if ('isEdited' in message) {
                this.messages[message._conversation][message._id]['isEdited'] = message.isEdited;
            }

            // check _replyToMessage
            if ('_replyToMessage' in message) {
                this.messages[message._conversation][message._id]['_replyToMessage'] = message._replyToMessage;
            }

            // add uploading if exists
            if ('uploading' in message) {
                this.messages[message._conversation][message._id]['uploading'] = message.uploading;
            }

            // add uploading if exists
            if ('attachment' in message) {
                this.messages[message._conversation][message._id]['attachment'] = message.attachment;
            }


            // switch for message type and set special fields
            switch (message.type) {
                case 'text':
                    this.messages[message._conversation][message._id]['content'] = message.content;
                    break;
            }

        },
        readMessage(message, userId) {
            if (this.messages[message._conversation][message._id]) {
                if (!this.messages[message._conversation][message._id]._readBy.includes(userId)) {
                    // push user id to _readBy
                    this.messages[message._conversation][message._id]._readBy.push(userId);
                }
            } else {
                this.messages[message._conversation][message._id]         = {};
                this.messages[message._conversation][message._id]._readBy = [userId];
            }
        },
        deleteMessage(message) {
            if (this.messages[message._conversation][message._id]) {
                delete this.messages[message._conversation][message._id];
            }
        },
        clearMessages(_conversation) {
            if (this.messages[_conversation]) {
                this.messages[_conversation] = {};
            }
        },
        changeReadCount(_conversation, operation) {
            switch (operation) {
                case 'add':
                    this.conversations[_conversation].unreadCount++;
                    break;
                case 'minus':
                    this.conversations[_conversation].unreadCount--;
                    break;
            }
        },
        addUpload(upload) {
            // create the message upload
            if (!this.uploads[upload._message])
                this.uploads[upload._message] = {};

            this.uploads[upload._message]['_message']         = upload._message;
            this.uploads[upload._message]['_conversation']    = upload._conversation;
            this.uploads[upload._message]['controller']       = upload.controller;
            this.uploads[upload._message]['uploadedBytes']    = upload.uploadedBytes;
            this.uploads[upload._message]['uploadedProgress'] = upload.uploadedProgress;

        },
        updateUploadProgress(_message, progress) {
            this.uploads[_message]['uploadedBytes']    = progress.uploadedBytes;
            this.uploads[_message]['uploadedProgress'] = progress.uploadedProgress;
        },
        deleteUpload(upload) {
            if (this.uploads[upload._message]) {
                // delete upload message
                delete this.messages[this.uploads[upload._message]._conversation][upload._message];

                // delete the conversation
                delete this.uploads[upload._message];
            }
        },
        clearUploads() {
            Object.values(this.uploads).forEach(upload => {
                // delete the message
                delete this.messages[upload._conversation][upload._message];

                // delete the upload
                delete this.uploads[upload._message];
            })
        },
        enableDownload(message) {
            if (this.messages[message._conversation][message._id]) {
                this.messages[message._conversation][message._id]['downloading'] = true;
            }
        },
        disableDownload(message) {
            if (this.messages[message._conversation][message._id]) {
                this.messages[message._conversation][message._id]['downloading'] = false;
            }
        },
        addDownload(download) {
            // create the message upload
            if (!this.downloads[download._message])
                this.downloads[download._message] = {};

            this.downloads[download._message]['_message']           = download._message;
            this.downloads[download._message]['_conversation']      = download._conversation;
            this.downloads[download._message]['cancelToken']        = download.cancelToken;
            this.downloads[download._message]['downloadedBytes']    = download.downloadedBytes;
            this.downloads[download._message]['downloadedProgress'] = download.downloadedProgress;

        },
        updateDownloadProgress(_message, progress) {
            this.downloads[_message]['downloadedBytes']    = progress.downloadedBytes;
            this.downloads[_message]['downloadedProgress'] = progress.downloadedProgress;
        },
        deleteDownload(_message) {
            if (this.downloads[_message]) {
                delete this.downloads[_message];
            }
        },
        setDownloadState(_conversation, _message, state) {
            if (this.messages[_conversation][_message]) {
                this.messages[_conversation][_message]['downloaded'] = state;
            }
        },
        clearDownloads() {
            Object.values(this.downloads).forEach(upload => {
                // delete the download
                delete this.downloads[upload._message];
            })
        }
    },
    persist: true
});
