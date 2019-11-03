import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancesComponent } from './avances.component';

describe('AvancesComponent', () => {
  let component: AvancesComponent;
  let fixture: ComponentFixture<AvancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
