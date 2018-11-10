import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSideListComponent } from './users-side-list.component';

describe('UsersSideListComponent', () => {
  let component: UsersSideListComponent;
  let fixture: ComponentFixture<UsersSideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
