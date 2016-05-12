var http={
	list:'http://localhost:3000/product',
	product: 'http://localhost:3000/product/'
};

function clear(id){
	$(id).html('');
}

function updateProduct(data){
	clear('#selecionar');
	var options='<option selected value="select">Selecione um produto...</option>';options+='<option value="todos">todos</option>';
	$('#selecionar').append(options);
	for (var c=0;c<data.length;c++){
		if(data[c].status==='I') {options='<option value='+data[c].id+' style="color:red">'+data[c].nome+'</option>';}
		else {options='<option value='+data[c].id+'>'+data[c].nome+'</option>';}
		$('#selecionar').append(options);
	}
}

function implementAllContent(data){
	var result;
	for (var c=0;c<data.length;c++){
		if(data[c].status==='I') {result+='<tr style="color:red">';}
		else {result+='<tr>';}
		result+='<td>'+data[c].nome+'</td>'+'<td>R$ '+data[c].valor+'</td>'+'<td>'+data[c].status+'</td>'+'<td>'+data[c].estoque+'</td>'+'</tr>';
	}
	return result;
}

function implementContent(data){
	var result;
	result+='<tr>'+'<td>'+data.nome+'</td>'+'<td>R$ '+data.valor+'</td>'+'<td>'+data.status+'</td>'+'<td>'+data.estoque+'</td>'+'</tr>';
	if(data.status==='I') {result+='<tr><td colspan="4" style="color:red">Este produto não está ativo</td></tr>';}
	return result;
}

function showContent(allData, url){
	$.getJSON(url, function(data){
		clear('#table');
		var result='<tr><th>Nome</th>'+'<th>Valor</th>'+'<th>Status</th>'+'<th>Estoque</th></tr>';
		$('#table').append(result);
		if(allData===true){
			updateProduct(data);
			$('#selecionar').val('todos');
			result=implementAllContent(data);
		}
		else{
			result=implementContent(data);
		}
		$('#table').append(result);
	})
}

function selectFilter(){
	var selectValue=$('#selecionar').val();
	if(selectValue==='select'){
		clear('#table');
	}
	else if(selectValue==='todos') {showContent(true, http.list);}
	else if(selectValue>0) {showContent(false, http.product+selectValue);}
}

function remove(selectValue){
	var value=$('#selecionar').val();
	$.ajax({
		url: http.product+value,
		type: 'DELETE',
		success: function(){
			updateAll();
			clear('#table');
			addCssClass(['#update', '#delete'], 'hide');
			removeCssClass(['#create'], 'hide');
		}
	})
}

$(document).ready(function(){
	updateAll();
	$('#selecionar').change(function(){
		selectFilter();
	});

})