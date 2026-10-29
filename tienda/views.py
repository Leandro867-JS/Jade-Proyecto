from rest_framework import viewsets
from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    # Solo mostramos los productos que estén marcados como disponibles
    queryset = Producto.objects.filter(disponible=True)
    serializer_class = ProductoSerializer
