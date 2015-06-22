define(function() {
	/*
	Функция принимает массив чисел и возвращает отношение каждого к их сумме
	Returns array of ratios
	*/
	return function(numbers) {
	    var sum=0,i,r=[];
	    for (i=0;i<numbers.length;++i) sum+=numbers[i];
	    for (i=0;i<numbers.length;++i) r.push(numbers[i]/sum);
	    return r;
	}
});