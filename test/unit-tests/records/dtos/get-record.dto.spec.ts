import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getRecordDtoStub } from '../mocks/records.stub';
import { GetRecordDto } from '../../../../src/common/records/dtos/get-record.dto';

describe('DeleteRecordDto', () => {
  let dto: GetRecordDto;

  beforeEach(() => {
    dto = {
      id: getRecordDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetRecordDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * id
   */
  describe('id', () => {
    it('should fail when id is empty', async () => {
      // Arrange
      dto.id = '';
      const dtoObject = plainToInstance(GetRecordDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(GetRecordDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
