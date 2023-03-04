import { deleteResult, recordsStub, recordStub } from './records.stub';

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
  findOne: jest.fn().mockResolvedValue(recordStub),
  create: jest.fn().mockResolvedValue(recordStub),
  save: jest.fn().mockResolvedValue(recordStub),
  update: jest.fn().mockResolvedValue(recordStub),
  delete: jest.fn().mockResolvedValue(deleteResult),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(recordsStub),
  })),
}));

export const createQueryBuilderMock: any = {
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(recordsStub),
};
