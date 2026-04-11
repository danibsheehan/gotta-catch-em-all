import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

const mockUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob',   email: 'bob@example.com' },
];

const mockUser: User = mockUsers[0];

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // ─── getUsers() ────────────────────────────────────────────────────────────

  describe('getUsers()', () => {
    it('should GET all users from /api/users', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should return an error when the request fails', () => {
      let errorMessage: string | undefined;

      service.getUsers().subscribe({
        error: (err: Error) => (errorMessage = err.message),
      });

      const req = httpMock.expectOne('/api/users');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(errorMessage).toBe('Failed to load users');
    });
  });

  // ─── getUserById() ─────────────────────────────────────────────────────────

  describe('getUserById()', () => {
    it('should GET a single user by id', () => {
      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return an error when id is 0', () => {
      let errorMessage: string | undefined;

      service.getUserById(0).subscribe({
        error: (err: Error) => (errorMessage = err.message),
      });

      httpMock.expectNone('/api/users/0');
      expect(errorMessage).toBe('Invalid ID');
    });

    it('should return an error when id is negative', () => {
      let errorMessage: string | undefined;

      service.getUserById(-5).subscribe({
        error: (err: Error) => (errorMessage = err.message),
      });

      httpMock.expectNone('/api/users/-5');
      expect(errorMessage).toBe('Invalid ID');
    });
  });

  // ─── createUser() ──────────────────────────────────────────────────────────

  describe('createUser()', () => {
    it('should POST a new user and return the created record', () => {
      const payload = { name: 'Carol', email: 'carol@example.com' };
      const created: User = { id: 3, ...payload };

      service.createUser(payload).subscribe(user => {
        expect(user).toEqual(created);
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(created);
    });
  });

  // ─── deleteUser() ──────────────────────────────────────────────────────────

  describe('deleteUser()', () => {
    it('should DELETE a user by id', () => {
      service.deleteUser(1).subscribe(result => {
        expect(result).toBeUndefined();
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
