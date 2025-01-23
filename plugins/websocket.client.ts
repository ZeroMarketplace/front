import {io} from 'socket.io-client';

export default defineNuxtPlugin(nuxtApp => {
    let socketConnection = undefined;
    const config = useRuntimeConfig();
    const token = useCookie('token');

    const createSocketConnection = () => {

        let options = {
            secure: true,
            transports: ['websocket']
        };

        if (token.value) {
            options.query = `token=${token.value}`;
        }

        if (!socketConnection)
            socketConnection = io(config.public.SOCKET_URL, options);
    };

    const destroySocketConnection = () => {
        socketConnection.destroy();
    };

    const getSocketConnection = () => {
        if (socketConnection)
            return socketConnection;
        else {
            createSocketConnection();
            return socketConnection;
        }

    };

    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            socketConnection: {
                create: createSocketConnection,
                destroy: destroySocketConnection,
                get: getSocketConnection,
            }
        }
    }
});
