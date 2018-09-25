import matplotlib.pyplot as plt 
import numpy as np 

# a = np.random.random((1000,1000))
a = [4, 3, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
# a = [[0.5,0,1,0.5,0.8]
#      ,[0.8,0.3,0.9,0.2,0.7]]
# print (a[0])


def normalize(v,arr):
    max_val = max(arr)
    return v/float(max_val)

def heatmap(array,width):
    matrix = []
    height =  len(array)/width
    acc = 0
    for j in range(0,height):
        a0 = []
        for i in range(0,width):
            val = normalize(array[i+acc],array)
            a0.append(val)
        matrix.append(a0)
        acc += width
    plt.imshow(matrix, cmap='hot', interpolation='gaussian')
    plt.show()

heatmap(b,10)