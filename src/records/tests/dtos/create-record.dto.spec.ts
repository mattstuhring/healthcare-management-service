import { validate } from 'class-validator';
import { CreateRecordDto } from '../../dtos/create-record.dto';
import { plainToInstance } from 'class-transformer';
import { createRecordDtoStub } from '../mocks/records.stub';

describe('CreateUserDto', () => {
  let dto: CreateRecordDto;

  beforeEach(() => {
    dto = {
      typeOfCare: createRecordDtoStub.typeOfCare,
      userId: createRecordDtoStub.userId,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(CreateRecordDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * typeOfCare
   */
  describe('typeOfCare', () => {
    it('should fail when typeOfCare is empty', async () => {
      // Arrange
      const testDto: any = {
        typeOfCare: '',
        userId: createRecordDtoStub.userId,
      };
      const dtoObject = plainToInstance(CreateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'typeOfCare should not be empty',
      );
    });

    it('should fail when typeOfCare is not an enum', async () => {
      // Arrange
      const testDto: any = {
        typeOfCare: 'test',
        userId: createRecordDtoStub.userId,
      };
      const dtoObject = plainToInstance(CreateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'typeOfCare must be a valid enum value',
      );
    });
  });

  /**
   * userId
   */
  describe('userId', () => {
    it('should fail when userId is empty', async () => {
      // Arrange
      dto.userId = '';
      const dtoObject = plainToInstance(CreateRecordDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('userId should not be empty');
    });

    it('should fail when userId is empty', async () => {
      // Arrange
      const testDto: any = {
        typeOfCare: 'test',
      };
      const dtoObject = plainToInstance(CreateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('userId should not be empty');
    });
  });
});
