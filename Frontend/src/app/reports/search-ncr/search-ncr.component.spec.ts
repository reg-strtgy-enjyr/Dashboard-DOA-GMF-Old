import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNcrComponent } from './search-ncr.component';

describe('SearchNcrComponent', () => {
  let component: SearchNcrComponent;
  let fixture: ComponentFixture<SearchNcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchNcrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchNcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
