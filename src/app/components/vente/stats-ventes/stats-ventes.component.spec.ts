import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsVentesComponent } from './stats-ventes.component';

describe('StatsVentesComponent', () => {
  let component: StatsVentesComponent;
  let fixture: ComponentFixture<StatsVentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsVentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
