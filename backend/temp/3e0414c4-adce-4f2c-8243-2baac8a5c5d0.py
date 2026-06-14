def solution():
    line = input().strip()
    n = int(line)
    
    if n == 0: 
        print(0)
        return
    if n == 1: 
        print(1)
        return
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    print(b)

solution()
