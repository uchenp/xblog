import os

for f in os.listdir('.'):
    if '测试' in f:
        print(f'Found: {repr(f)}')
        # 重命名文件，移除多余空格
        new_name = f.replace('  ', '').strip()
        if f != new_name:
            os.rename(f, new_name)
            print(f'Renamed to: {repr(new_name)}')
