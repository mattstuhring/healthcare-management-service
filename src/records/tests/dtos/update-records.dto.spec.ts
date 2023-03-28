import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { updateRecordDtoStub } from '../mocks/records.stub';
import { UpdateRecordDto } from '../../dtos/update-record.dto';

describe('UpdateRecordDto', () => {
  let dto: UpdateRecordDto;

  beforeEach(() => {
    dto = {
      typeOfCare: updateRecordDtoStub.typeOfCare,
      healthStatus: updateRecordDtoStub.healthStatus,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(UpdateRecordDto, dto);

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
      };
      const dtoObject = plainToInstance(UpdateRecordDto, testDto);

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
      };
      const dtoObject = plainToInstance(UpdateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'typeOfCare must be a valid enum value',
      );
    });
  });

  /**
   * healthStatus
   */
  describe('healthStatus', () => {
    it('should fail when healthStatus is empty', async () => {
      // Arrange
      const testDto: any = {
        healthStatus: '',
      };
      const dtoObject = plainToInstance(UpdateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'healthStatus should not be empty',
      );
    });

    it('should fail when healthStatus is not an enum', async () => {
      // Arrange
      const testDto: any = {
        typeOfCare: 'test',
      };
      const dtoObject = plainToInstance(UpdateRecordDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'healthStatus must be a valid enum value',
      );
    });
  });
});
