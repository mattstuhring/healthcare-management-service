import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getRecordsFilterDtoStub } from '../mocks/records.stub';
import { GetRecordsFilterDto } from '../../../../src/records/dtos/get-records-filter.dto';

describe('DeleteRecordDto', () => {
  let dto: GetRecordsFilterDto;

  beforeEach(() => {
    dto = {
      typeOfCare: getRecordsFilterDtoStub.typeOfCare,
      search: getRecordsFilterDtoStub.search,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetRecordsFilterDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should pass with no params', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetRecordsFilterDto, {});

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
      const dtoObject = plainToInstance(GetRecordsFilterDto, testDto);

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
      const dtoObject = plainToInstance(GetRecordsFilterDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'typeOfCare must be a valid enum value',
      );
    });
  });

  /**
   * search
   */
  describe('search', () => {
    it('should fail when search is empty', async () => {
      // Arrange
      dto.search = '';
      const dtoObject = plainToInstance(GetRecordsFilterDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('search should not be empty');
    });
  });
});
