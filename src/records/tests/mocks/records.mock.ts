import { recordsStub, janeDoePrimaryRecord } from './records.stub';

/**
 * Mocks
 * Mocks are objects that have predefined behavior.
 * These objects register calls they receive, allowing us to assert how we use them in the code.
 * Unlike fakes, mocks don’t have working implementations.
 * Instead, they have pre-programmed expectations about how they will be used in the code.
 *
 * Example
 * A mock object might be programmed to return a specific value when it is called with certain arguments.
 * Mocks are generally used to test the behavior of our code rather than its output.
 * We can use mocks to verify that our code is calling the dependencies in an expected way.
 */
export const recordsRepositoryMock = jest.fn(() => ({
  findOneBy: jest.fn().mockResolvedValue(janeDoePrimaryRecord),
  create: jest.fn().mockResolvedValue(janeDoePrimaryRecord),
  save: jest.fn().mockResolvedValue(janeDoePrimaryRecord),
  update: jest.fn().mockResolvedValue(janeDoePrimaryRecord),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(recordsStub),
  })),
}));

export const createQueryBuilderMock: any = {
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(recordsStub),
};
