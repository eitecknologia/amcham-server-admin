/* Pagination Function */
export const validatePaginateParams = (page: any, size: any): Promise<{ limit: number, offset: number, pageSend: number, sizeSend: number }> => {
    return new Promise(async (resolve, reject) => {
        const pageAsNumber = Number.parseInt(page);
        const sizeAsNumber = Number.parseInt(size);

        let pageSend = 1;
        let sizeSend = 15;
        let limit, offset: number;

        try {
            if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 16) {
                sizeSend = sizeAsNumber;
            }

            if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
                pageSend = pageAsNumber;
            }
            limit = sizeSend;
            offset = pageSend * sizeSend;
            resolve({ limit, offset, pageSend, sizeSend });
        } catch (error) {
            limit = sizeSend;
            offset = pageSend * sizeSend;
            reject({ limit, offset, pageSend, sizeSend });
        }
    })
}

/* Calculate the information for the paginate */
export const infoPaginate = async (totalPages: number, total: number, pageSend: number, sizeSend: number) => {
    const info = {
        total,
        totalPages,
        currentPage: pageSend,
        hasPrevPage: (pageSend === 1 || pageSend > totalPages) ? false : true,
        prevPage: (pageSend === 1 || pageSend > totalPages) ? null : (pageSend - 1),
        hasNextPage: (pageSend < totalPages) ? true : false,
        nextPage: (pageSend < totalPages) ? (pageSend + 1) : null,
        limit: sizeSend
    }

    if (info.currentPage > info.totalPages) {
        return { msg: 'Página no encontrada' }
    }

    return info;
}