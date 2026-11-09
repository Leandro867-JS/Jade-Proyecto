from rest_framework import viewsets
from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductoSerializer

    def get_queryset(self):
        queryset = (
            Producto.objects
            .filter(disponible=True)
            .select_related('categoria')
            .order_by('-fecha_creacion')
        )
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria__nombre__iexact=categoria)
        return queryset
