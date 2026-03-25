import React, { useState, useEffect } from 'react'
import { Button, Tooltip, Space } from 'antd'
import { SettingOutlined, CheckOutlined } from '@ant-design/icons'

/**
 * 颜色方案切换器组件
 * 允许用户在不同的配色方案之间切换
 */
function ColorSchemeSwitcher() {
  const [currentScheme, setCurrentScheme] = useState('blue')

  // 切换颜色方案
  const switchColorScheme = (scheme) => {
    setCurrentScheme(scheme)
    
    // 应用颜色方案
    const root = document.documentElement
    if (scheme === 'blue') {
      // 方案1：知识蓝
      root.style.setProperty('--primary-color', '#3b82f6')
      root.style.setProperty('--primary-light', '#60a5fa')
      root.style.setProperty('--primary-dark', '#2563eb')
      root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)')
      root.style.setProperty('--primary-subtle', 'rgba(59, 130, 246, 0.1)')
      root.style.setProperty('--secondary-color', '#10b981')
      root.style.setProperty('--accent-color', '#f97316')
    } else if (scheme === 'orange') {
      // 方案2：活力橙
      root.style.setProperty('--primary-color', '#f97316')
      root.style.setProperty('--primary-light', '#fb923c')
      root.style.setProperty('--primary-dark', '#ea580c')
      root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)')
      root.style.setProperty('--primary-subtle', 'rgba(249, 115, 22, 0.1)')
      root.style.setProperty('--secondary-color', '#3b82f6')
      root.style.setProperty('--accent-color', '#10b981')
    } else if (scheme === 'green') {
      // 方案3：清新绿
      root.style.setProperty('--primary-color', '#10b981')
      root.style.setProperty('--primary-light', '#34d399')
      root.style.setProperty('--primary-dark', '#059669')
      root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #10b981 0%, #059669 100%)')
      root.style.setProperty('--primary-subtle', 'rgba(16, 185, 129, 0.1)')
      root.style.setProperty('--secondary-color', '#3b82f6')
      root.style.setProperty('--accent-color', '#f97316')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      zIndex: 1001,
      background: 'var(--bg-primary)',
      padding: 'var(--spacing-4)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{
        marginBottom: 'var(--spacing-3)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-primary)',
        textAlign: 'center'
      }}>
        颜色方案
      </div>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Tooltip title="知识蓝（默认）">
          <Button
            type={currentScheme === 'blue' ? 'primary' : 'default'}
            block
            onClick={() => switchColorScheme('blue')}
            icon={currentScheme === 'blue' ? <CheckOutlined /> : null}
            style={{
              background: currentScheme === 'blue' ? '#3b82f6' : 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            知识蓝
          </Button>
        </Tooltip>
        <Tooltip title="活力橙">
          <Button
            type={currentScheme === 'orange' ? 'primary' : 'default'}
            block
            onClick={() => switchColorScheme('orange')}
            icon={currentScheme === 'orange' ? <CheckOutlined /> : null}
            style={{
              background: currentScheme === 'orange' ? '#f97316' : 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            活力橙
          </Button>
        </Tooltip>
        <Tooltip title="清新绿">
          <Button
            type={currentScheme === 'green' ? 'primary' : 'default'}
            block
            onClick={() => switchColorScheme('green')}
            icon={currentScheme === 'green' ? <CheckOutlined /> : null}
            style={{
              background: currentScheme === 'green' ? '#10b981' : 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            清新绿
          </Button>
        </Tooltip>
      </Space>
    </div>
  )
}

export default ColorSchemeSwitcher