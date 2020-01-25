import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';  // added
import { CasesService, ISoftwares, IEmployeeSkills} from './cases.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CasesService', () => {

  let service: CasesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],  // added
      providers: [
        CasesService,
        { provide: 'BASE_URL', useValue: document.getElementsByTagName('base')[0].href }
      ]   // added, not sure this will work for actual mocking later though

    });

    service = TestBed.get(CasesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {   
    expect(service).toBeTruthy();
  });

  describe('Software HTTP', () => {
    const dummySoftwareTitles: ISoftwares[] = [
      { id: 1, name: "Row&Go1" },
      { id: 2, name: "Bengal Tiger" },
      { id: 3, name: "GymBooker" },
      { id: 4, name: "TrackIT" },
    ];


    it('should get all the software titles from the API', () => {

      service.getSoftwareTitles().subscribe(titles => {
        console.log("Software GET (all) test, result:")
        console.log(titles);
        expect(titles.length).toBe(4);
        expect(titles).toEqual(dummySoftwareTitles);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/Softwares');
      request.flush(dummySoftwareTitles);
      expect(request.request.method).toBe('GET');

    });

    it('should get the software title with id of 3 from the API', () => {
      const id = 3;

      service.getSoftwareTitle(id).subscribe(title => {
        console.log("Software GET (single) test, result:")
        console.log(title);
        expect(title.id).toEqual(3);
        expect(title.name).toEqual("GymBooker");
        expect(title).toEqual(dummySoftwareTitles[2]);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/Softwares' + "/" + id);
      request.flush(dummySoftwareTitles[2]);
      expect(request.request.method).toBe('GET');

    });

    it('should post a new software title via the API', () => {
      const dummySoftwareTitle =
        { name: "TestApp" };
      // You don't actually post the id in most cases because it is generated in the database automatically

      service.addSoftwareTitle(dummySoftwareTitle).subscribe(title => {
        console.log("Software POST test, result:")
        console.log(title);
        expect(title).toEqual(dummySoftwareTitle);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/Softwares');
      request.flush(dummySoftwareTitle);
      expect(request.request.method).toBe('POST');

    });

    it('should update an existing software title via the API', () => {
      const id = 3;

      const dummySoftwareTitle =
        { id: id, name: "GymBooker/GymTime" };

      service.updateSoftwareTitle(dummySoftwareTitle).subscribe(title => {
        console.log("Software PUT test, result:")
        console.log(title);
        expect(title).toEqual(dummySoftwareTitle);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/Softwares' + '/' + id);
      request.flush(dummySoftwareTitle);
      expect(request.request.method).toBe('PUT');     

    });

    it('should delete an existing software title via the API', () => {
      const id = 2;

      service.deleteSoftwareTitle(id).subscribe(result => {
        console.log("Software DELETE test, result:")
        console.log(result);
        expect(result).toEqual(id);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/Softwares' + '/' + id);
      request.flush(id);
      expect(request.request.method).toBe('DELETE');     

    });
      

  });


  describe('Employee Skills HTTP', () => {

    const dummyEmployeeSkills: IEmployeeSkills[] = [
      { id: 1, skillsId: 1, experience: 1, userId: "a1", user: null, skills: { id: 1, name: "C#", type: 1 } },
      { id: 2, skillsId: 2, experience: 2, userId: "a1", user: null, skills: { id: 2, name: "Javascript", type: 1 } },
      { id: 3, skillsId: 3, experience: 3, userId: "a1", user: null, skills: { id: 3, name: "Python", type: 1 } },
      { id: 4, skillsId: 4, experience: 2, userId: "a2", user: null, skills: { id: 4, name: "C", type: 1 } },
      { id: 5, skillsId: 2, experience: 2, userId: "a2", user: null, skills: { id: 2, name: "Javascript", type: 1 } },
      { id: 7, skillsId: 6, experience: 1, userId: "a2", user: null, skills: { id: 6, name: "Laravel", type: 2 } },
      { id: 8, skillsId: 7, experience: 2, userId: "a1", user: null, skills: { id: 7, name: "ASP.Net Core", type: 2 } }
    ];

    it('should get a specific skill by id (from the API)', () => {
      const id = 3;

      service.getEmployeeSkill(id).subscribe(result => {
        console.log("Employee Skills GET specific employee skill test, result:")
        console.log(result);
        expect(result).toEqual(dummyEmployeeSkills[2]);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/EmployeeSkillById/' + id);
      request.flush(dummyEmployeeSkills[2]);
      expect(request.request.method).toBe('GET');

    });   

    it('should get all skills of a single employee (from the API)', () => {
      const userId = "a2";

      const dummyResult = dummyEmployeeSkills.filter(x => {
        return x.userId == userId;
      });

      console.log(dummyResult);

      service.getAllEmployeeSkills(userId).subscribe(result => {
        console.log("Employee Skills GET all skills of a single employee test, result:");
        console.log(result);
        expect(result[1]).toBe(dummyEmployeeSkills[4]);
        expect(result).toEqual(dummyResult);
      });

      const request = httpTestingController.expectOne("http://localhost:9876/" + 'api/AllEmployeeSkills/' + userId);
      request.flush(dummyResult);
      expect(request.request.method).toBe('GET');

    });

  });


  fit('should demonstrate Jasmine:done', ((done) => {
    const start = performance.now();

    setTimeout(() => {
      expect(1).toBe(1);
      const end = performance.now() - start;
      console.log(end); // expect ~3000ms
      done();
    }, 3000);
  }));

  fit('should demonstrate Jasmine:fakeAsync', fakeAsync(() => {
    const start = performance.now();

    setTimeout(() => {
      expect(1).toBe(1);
      const end = performance.now() - start;
      console.log(end); // expect much less then above
    }, 3000);

    tick(3000);

  }));

  

    

  
   

});

