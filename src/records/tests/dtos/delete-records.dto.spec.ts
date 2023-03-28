import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { deleteRecordDtoStub } from '../mocks/records.stub';
import { DeleteRecordDto } from '../../dtos/delete-record.dto';

describe('DeleteRecordDto', () => {
  let dto: DeleteRecordDto;

  beforeEach(() => {
    dto = {
      id: deleteRecordDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(DeleteRecordDto, dto);

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
      const dtoObject = plainToInstance(DeleteRecordDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(DeleteRecordDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
