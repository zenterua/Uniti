import { NgModule } from '@angular/core';
import { OnlyNumber } from './number/number.pipe';
import { UniqueArray } from './number/unique.pipe';
import { SumPipe } from './number/summ.pipe';
import { OrderBy } from './number/orderby.pipe';

@NgModule({
	declarations: [OnlyNumber, UniqueArray, SumPipe, OrderBy],
	imports: [],
	exports: [OnlyNumber, UniqueArray, SumPipe, OrderBy]
})
export class PipesModule {}