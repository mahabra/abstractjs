define(function() {
	/*
	Принимает массив числовых значений и разбивает его
	на группы, суммы входящих чисел в которых приблизительно равны
	При keys=true возвращает массив с ключами
	*/
	return function(values, count, keys) {
	  var i = 0,sum=0,cogn,groups=[[]],lsum=0;
	  for (;i<values.length;++i) {
	    sum+=values[i];
	  }
	  cogn = sum/count;
	  
	  for (i=0;i<values.length;++i) {
	    lsum+=values[i];
	    groups[groups.length-1].push(keys ? i : values[i]);
	    if (lsum>cogn&&i<values.length-1) {groups.push([]);lsum=0;}
	  }
	  
	  return groups;
	}
});