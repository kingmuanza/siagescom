/* SmtpJS.com - v3.0.0 */
// tslint:disable-next-line:object-literal-shorthand
// tslint:disable-next-line:max-line-length tslint:disable-next-line:max-line-length
export const Email = {
    send(a) {
        return new Promise((n, e) => {
            a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = 'Send';
            const t = JSON.stringify(a);
            // tslint:disable-next-line:only-arrow-functions
            // tslint:disable-next-line: no-shadowed-variable
            Email.ajaxPost('https://smtpjs.com/v3/smtpjs.aspx?', t,  (e) => { n(e); });
        });
    },
    ajaxPost(e, n, t) {
        const a = Email.createCORSRequest('POST', e);
        a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
            a.onload = () => {
                // tslint:disable-next-line:no-shadowed-variable
                const e = a.responseText;
                // tslint:disable-next-line:no-unused-expression
                null != t && t(e);
            }, a.send(n);
    },
    ajax(e, n) {
        const t = Email.createCORSRequest('GET', e);
        t.onload = () => {
            // tslint:disable-next-line:no-shadowed-variable
            const e = t.responseText;
            // tslint:disable-next-line:no-unused-expression
            null != n && n(e);
        }, t.send();
    },
    createCORSRequest(e, n) {
        // tslint:disable-next-line:new-parens
        const t = new XMLHttpRequest;
        // tslint:disable-next-line:max-line-length
        const a = null;
        return 'withCredentials' in t ? t.open(e, n, !0) : a;
    }
};
