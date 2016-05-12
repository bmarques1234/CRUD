var http={
	list:'http://localhost:3000/product',
	product: 'http://localhost:3000/product/'
};

function removeCssClass(itens, classe){
	for(var c=0; c<itens.length; c++){
		$(itens[c]).removeClass(classe);
	}
}

function addCssClass(itens, classe){
	for(var c=0; c<itens.length; c++){
		$(itens[c]).addClass(classe);
	}
}

function clear(id){
	$(id).html('');
	removeCssClass(['#conteudo'], 'content');
}

function updateAll(){
	$.getJSON(http.list, function(data){
		updateProduct(data);
	});
}

function updateForm(data){
	if(data!==''){
		$('#name').val(data.nome);
		$('#value').val(data.valor);
		$('input[value='+data.status+']').prop('checked', true);
		$('#quantity').val(data.estoque);
	}
	else{
		$('#name').val('');
		$('#value').val('');
		$('input[value=A]').prop('checked', true);
		$('#quantity').val('');
	}
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
			removeCssClass(['#create'], 'hide');
			addCssClass(['#delete', '#update', '#send', '#edit'], 'hide');
			updateForm('');
		}
		else{
			result=implementContent(data);
			removeCssClass(['#delete', '#update'], 'hide');
			addCssClass(['#delete', '#update', '#create'], 'size');
			addCssClass(['#create', '#send', '#edit'], 'hide');
			updateForm(data);
		}
		$('#table').append(result);
		addCssClass(['#conteudo'], 'content');
	})
}

function selectFilter(){
	addCssClass(['#form', '#send'], 'hide');
	var selectValue=$('#selecionar').val();
	if(selectValue==='select'){
		addCssClass(['#send', '#edit', '#delete', '#update'], 'hide');
		removeCssClass(['#create'], 'hide');
		clear('#table');
		updateForm('');
	}
	else if(selectValue==='todos') {showContent(true, http.list);}
	else if(selectValue>0) {showContent(false, http.product+selectValue);}
}

function dataFile(){
	var file={
		nome: $('#name').val(),
		valor: $('#value').val(),
		status: $('input[name=status]:checked').val(),
		estoque: $('#quantity').val()
	}
	return file;
}

function request(file, type, url){
	$.ajax({
		url: url,
		type: type,
		data: file,
		success: function(){
			updateAll();
			clear('#table');
			removeCssClass(['#create'], 'hide');
			updateForm('');
		}
	})
	addCssClass(['#form', '#send', '#edit'], 'hide');
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
			updateForm('');
		}
	})
}

function replace(pattern, replacement, subject){
	return subject.replace(pattern, replacement);
}

$(document).ready(function(){
	updateAll();
	$('#selecionar').change(function(){
		selectFilter();
	});
	$('#delete').click(function(){
		remove();
	})
	$('#create').click(function(){
		clear('#table');
		removeCssClass(['#form', '#send'], 'hide');
		addCssClass(['#form', '#create', '#send'], 'size');
		addCssClass(['#create'], 'hide');
	})
	$('#send').click(function(){
		var file=dataFile();
		form=dataFile();
		if($("#name").val()!=='' && $("#valor").val()!=='' && $("#quantity").val()!==''){
			request(file, 'POST', http.list);
		}
		else{alert('Por favor reveja os dados referentes ao produto.')}
	})
	$('#update').click(function(){
		var file=dataFile();
		removeCssClass(['#form', '#edit'], 'hide');
		addCssClass(['#form', '#update', '#edit'], 'size');
		addCssClass(['#update', '#delete'], 'hide');
		clear('#table');
	})
	$('#edit').click(function(){
		var file=dataFile();
		if($("#name").val()!=='' && $("#valor").val()!=='' && $("#quantity").val()!==''){
			request(file, 'PUT', http.product+$('#selecionar').val());
		}
		else{alert('Por favor reveja os dados referentes ao produto.')}
	})
	$('#name').keyup(function(){
		var nome=$(this).val();
		var result=nome.replace(/[^a-zçáâãéêíóôõú]/g, '');
		$(this).val(result);
	})
	$('#value').keyup(function(){
		var nome=$(this).val();
		var result=nome.replace(/[^0-9.]/g, '');
		$(this).val(result);
	})
	$('#quantity').keyup(function(){
		var nome=$(this).val();
		var result=nome.replace(/[^0-9]/g, '');
		$(this).val(result);
	})
})