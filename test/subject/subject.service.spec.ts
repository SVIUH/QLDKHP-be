import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from '../../src/subject/subject.service';
import { SubjectRepository } from '../../src/subject/subject.repository';
import { CommonService } from '../../src/common/common.service';

describe('SubjectService', () => {
  let service: SubjectService;
  let repository: SubjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: SubjectRepository,
          useValue: {
            createSubject: jest.fn().mockResolvedValue({
              subject: {
                subject_id: 'generated-id',
                subject_name: 'Math',
                credits: 3,
                term: 1,
                department: 'Mathematics',
                description: 'Basic math course',
                isRequired: true,
                theory: 30,
                practice: 15,
              },
              prerequisites: [],
            }),
            getAllSubjects: jest.fn().mockResolvedValue([
              {
                subject_id: 'sub123',
                subject_name: 'Math',
                grades: [{ student_id: 1, digit_score: 5 }],
              },
              {
                subject_id: 'sub124',
                subject_name: 'Physics',
                grades: [{ student_id: 1, digit_score: 3 }],
              },
            ]),
            getSubjectById: jest.fn().mockResolvedValue({
              subject_id: 'sub123',
              subject_name: 'Math',
            }),
            currentCredit: jest.fn().mockResolvedValue({
              subject: { credits: 3 },
            }),
          },
        },
        {
          provide: CommonService,
          useValue: {
            generateId: jest.fn().mockReturnValue('mocked-id'),  // Mock generateId
            deleteField: jest.fn().mockReturnValue([{ subject_name: 'Math' }, { subject_name: 'Physics' }]),  // Mock deleteField
          },
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    repository = module.get<SubjectRepository>(SubjectRepository);
  });

  it('should create a subject', async () => {
    const data = {
      subject: {
        subject_id: 123,
        subject_name: 'Math',
        credits: 3,
        term: '1',
        department: 'Mathematics',
        description: 'Basic math course',
        isRequired: true,
        theory: 30,
        practice: 15,
      },
      prerequisites: [],
    };

    const result = await service.createSubject(data);

    expect(repository.createSubject).toHaveBeenCalledWith({
      prerequisites: [],
      subject: expect.objectContaining({
        subject_id: 'mocked-id',  // Đảm bảo ID là giá trị giả lập
        subject_name: 'Math',
        credits: 3,
        term: 1,
        department: 'Mathematics',
        description: 'Basic math course',
        isRequired: true,
        theory: 30,
        practice: 15,
      }),
    });

    expect(result).toEqual({
      subject: expect.objectContaining({
        subject_id: 'mocked-id',
        subject_name: 'Math',
      }),
      prerequisites: [],
    });
  });

  it('should get all subjects', async () => {
    const result = await service.getAllSubjects(1);

    expect(repository.getAllSubjects).toHaveBeenCalled();
    expect(result).toEqual([
      {
        subject_id: 'sub123',
        subject_name: 'Math',
        status: true,
      },
      {
        subject_id: 'sub124',
        subject_name: 'Physics',
        status: false,
      },
    ]);
  });

  it('should get subject by ID', async () => {
    const result = await service.getSubjectById(123);

    expect(repository.getSubjectById).toHaveBeenCalledWith(123);
    expect(result).toEqual({
      subject_id: 'sub123',
      subject_name: 'Math',
    });
  });

  it('should return current credit of a subject', async () => {
    const result = await service.currentCreditOfSubject(1);

    expect(repository.currentCredit).toHaveBeenCalledWith(1);
    expect(result).toBe(3);
  });
});