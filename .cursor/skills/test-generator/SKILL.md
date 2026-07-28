---
name: test-generator
description: Generates Vitest unit tests for TypeScript and Angular code. Use this skill whenever the user wants to write tests, generate test files, add test coverage, test a component/service/pipe/directive, or asks anything like "write tests for this", "generate specs", "add unit tests", "test this component", "how do I test this service", or "improve my test coverage". Trigger even if the user just pastes code and asks broadly how to improve it — testing is often the right answer.
---

# Test Generator — TypeScript / Angular (Vitest)

Generate thorough, idiomatic Vitest unit tests for Angular and plain TypeScript code (via `@angular/build:unit-test`).

---

## Workflow

1. **Understand the code** — Read the file(s) provided. Identify:
   - Type: Angular Component, Service, Pipe, Directive, Guard, Interceptor, or plain TS class/function
   - Dependencies: injected services, HTTP calls, Observables, Input/Output bindings, Router, Store, etc.
   - Public API: all public methods and properties to be tested

2. **Plan the test suite** — Before writing, outline:
   - Which behaviours need a `describe` block
   - Happy-path cases
   - Edge cases (empty input, null/undefined, boundary values)
   - Error cases (thrown exceptions, HTTP errors, rejected Promises/Observables)
   - Any async flows (`fakeAsync`/`tick`, `async`/`await`, `firstValueFrom`)

3. **Generate the spec file** — Follow the conventions below, then write the full file.

4. **Show tests in chat** — Always display the generated spec in a code block so the user can review it.

5. **Save to disk** — Write the spec file to the correct path (see Naming below).

---

## Spec File Conventions

### Naming
| Source file | Spec file |
|---|---|
| `foo.component.ts` | `foo.component.spec.ts` |
| `foo.service.ts` | `foo.service.spec.ts` |
| `foo.pipe.ts` | `foo.pipe.spec.ts` |
| `foo.directive.ts` | `foo.directive.spec.ts` |
| `foo.ts` | `foo.spec.ts` |

Place the spec file **next to** the source file unless the user specifies otherwise.

### Imports & TestBed Setup

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
```

- Use `TestBed.configureTestingModule({...})` for Angular classes.
- For plain TS, instantiate directly — no TestBed needed.
- Mock dependencies with `vi.fn()` / `vi.spyOn()` (Vitest globals are enabled).
- Prefer `provideHttpClient()` + `provideHttpClientTesting()` over legacy `HttpClientTestingModule`.

### Structure Template

```typescript
describe('ClassName', () => {
  let instance: ClassName;
  // declare fixture, mocks, etc.

  beforeEach(() => {
    // TestBed or direct instantiation
  });

  afterEach(() => {
    // httpMock.verify() if applicable
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  describe('methodName()', () => {
    it('should <expected behaviour> when <condition>', () => { ... });
    it('should <handle edge case>', () => { ... });
    it('should <handle error case>', () => { ... });
  });
});
```

### Angular-Specific Patterns

**Component with template:**
```typescript
fixture = TestBed.createComponent(MyComponent);
component = fixture.componentInstance;
fixture.detectChanges(); // triggers ngOnInit
```

**Mocking a service:**
```typescript
const myServiceSpy = {
  getData: vi.fn(),
  save: vi.fn(),
};
providers: [{ provide: MyService, useValue: myServiceSpy }]
```

**Testing Observables:**
```typescript
it('should emit value', async () => {
  const result = await firstValueFrom(component.value$);
  expect(result).toBe('expected');
});
```

**Testing @Input / @Output:**
```typescript
component.myInput = 'test';
fixture.detectChanges();
component.myOutput.subscribe(val => expect(val).toBe('expected'));
component.triggerAction();
```

**Testing Router navigation:**
```typescript
const router = TestBed.inject(Router);
const spy = vi.spyOn(router, 'navigate');
component.goSomewhere();
expect(spy).toHaveBeenCalledWith(['/expected-path']);
```

**HTTP service tests:**
```typescript
it('should GET data', () => {
  service.fetchData().subscribe(data => expect(data).toEqual(mockData));
  const req = httpMock.expectOne('/api/data');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});
```

---

## Test Coverage Checklist

Make sure to cover:
- [ ] Creation / instantiation
- [ ] Each public method — happy path
- [ ] Each public method — edge cases (null, empty, boundary)
- [ ] Each public method — error/exception path
- [ ] Async flows (Promises, Observables, timers)
- [ ] Component lifecycle hooks (ngOnInit, ngOnDestroy)
- [ ] Template interactions (if component has a template)
- [ ] Input/Output bindings (Angular components)
- [ ] HTTP request method, URL, and payload (services)
- [ ] HTTP error handling (4xx, 5xx)

---

## Quality Rules

- **One assertion focus per `it` block** — keep tests atomic.
- **Descriptive names** — `it('should return null when input is empty')` not `it('works')`.
- **No magic numbers** — use named constants or descriptive variables for test data.
- **Reset state** — use `beforeEach` to reinitialise; never share mutable state across tests.
- **No `any` unless unavoidable** — keep TypeScript types in specs too.
- **Don't test implementation details** — test observable behaviour, not private internals.

---

## Output

1. Show the complete spec file in a TypeScript code block in chat.
2. Save the file to disk at the correct path (next to source file, or as user specifies).
3. Briefly summarise what was generated:
   - Number of `describe` blocks and `it` cases
   - Any notable mocking strategies used
   - Any gaps where the user should add domain-specific test data

---

## This repo (`gotta-catch-em-all`)

- Run **`npm run test:ci`** for a single Vitest pass with coverage (CI parity); **`npm test`** is watch mode.
