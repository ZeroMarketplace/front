// @ts-ignore
const {$showMessage} = useNuxtApp();

class AppAgent {
    static API_URL = this.runtimeConfig.public.API_BASE_URL;

    static Fetch($url, $data, callback, $options, $errorFunctions) {
        let $headers = {};

        // add JSON type content
        if (!$options.notJSON) {
            $headers.push({'Content-Type': 'application/json'});
        }

        // add user auth
        if ($options.auth) {
            $headers.push({'authorization': 'Bearer ' + $options.token});
        }

        // add method if not exists
        if (!$options.method) {
            $options.push({method: 'POST'});
        }

        fetch(AppAgent.API_URL + $url, {
            method : $options.method,
            headers: $headers,
        }).then(response => {
            if (response.status === 200) {
                callback();
            } else {
                // @ts-ignore
                if (response.status === 404) {
                    if ($errorFunctions.F404) {
                        $errorFunctions.F404(response);
                    } else {
                        $showMessage('پیدا نشد', 'error');
                    }
                } else if (response.status === 403) {
                    if ($errorFunctions.F403)
                        $errorFunctions.F403(response);
                    else
                        $showMessage('شما اجازه دسترسی ندارید', 'error');
                } else if (response.status === 401) {
                    if ($errorFunctions.F403)
                        $errorFunctions.F403(response);
                    else
                        $showMessage('مشکلی در انجام عملیات بوجود آمد. لطفا بعدا تلاش کنید', 'error');
                }
            }
        });
    }
}

module.exports = AppAgent;