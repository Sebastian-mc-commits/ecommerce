
export const retrieveProductsViewedByCookie = (cookie, cookieField, cookieName, res, { categoryType, _id, code }) => {

    const existCookie = cookie && cookie[cookieField]?.some(({ code: checkCode }) => code === checkCode);

    if (existCookie) return;
    if (cookie && cookie[cookieField]?.length <= 10) {
        cookie[cookieField] = [...cookie[cookieField], {
            _id,
            categoryType,
            code
        }]
    }

    else if (cookie && cookie[cookieField]?.length > 1) {
        cookie[cookieField][cookie[cookieField].length - 1] = {
            _id,
            categoryType,
            code
        }
    }

    else {
        cookie = {
            [cookieField]: [
                {
                    _id,
                    categoryType,
                    code
                }
            ]
        }
    }

    const date = new Date();
    return res.cookie(cookieName, {
        [cookieField]: cookie[cookieField]
    }, { expires: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000), signed: true, httpOnly: true, sameSite: "strict" });
}