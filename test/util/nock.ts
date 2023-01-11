import nock from 'nock';

export const checkNockIsDone = (): void => {
    if (!nock.isDone()) {
        const pendingMocks = nock.pendingMocks();

        nock.cleanAll();

        throw Error(
            `Not all Nock HTTP mocks were used! Pending mocks: ${pendingMocks}`
        );
    }
};
