define(function() {
	/*
	Функция принимает массив дробных чисел и величину.
	Возвращает массив числовых значений, полученных из этого отношения.
	Числа будут возвращены целые.
	При разсчете целых чисел не просто производится отсечение дробной части,
	а подгонка чисел для суммарного равенства quantity.
	*/
	return function(ratios, quantity) {
	  var i,r=[],sum=0,val;
	  for (i=0;i<ratios.length;++i) {
	    val=ratios[i]*quantity;
	    sum+=val-(val%1);
	    r.push(val-(val%1)); 
	  }
	  r[r.length-1]+=quantity-sum;
	  return r;
	}
});