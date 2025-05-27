"use client";

import React, { useState } from 'react';
import { Form, Calendar, Badge, Modal, Input, DatePicker, Select, Button, Tag, Alert, Tooltip, Radio, Descriptions, Empty, Card } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Maintenance, MaintenanceStatus, MaintenanceFrequency, MaintenanceReferenceType, Part } from '@/services/api';

type Dayjs = any; 
type CalendarMode = 'month' | 'day';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FilterOutlined,
  SettingOutlined,
  TagOutlined,
  ToolOutlined,
  ClearOutlined,
  CheckOutlined,
  FieldTimeOutlined,
  LeftOutlined,
  RightOutlined
} from "@ant-design/icons";

interface MaintenanceCalendarProps {
  maintenances: Maintenance[];
  parts: Part[];
  onEdit: (maintenance: Maintenance) => void;
  onStatusChange: (id: string, status: MaintenanceStatus) => void;
  onAdd?: (date?: Date) => void;
  onCreate?: (data: Omit<Maintenance, "id" | "createdAt" | "updatedAt">) => void;
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ 
  maintenances, 
  parts = [],
  onEdit,
  onStatusChange,
  onAdd,
  onCreate
}) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    partId: "",
    status: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const getMaintenancesForDate = (date: Dayjs) => {
    if (!maintenances || maintenances.length === 0) {
      return [];
    }

    const result = maintenances.filter((maintenance: Maintenance) => {
      if (!maintenance || !maintenance.dueDate) {
        return false;
      }
      
      const partMatch = !filters.partId || maintenance.partId === filters.partId;
      const statusMatch = !filters.status || maintenance.status === filters.status;
      
      const maintenanceDate = dayjs(maintenance.dueDate).format('YYYY-MM-DD');
      const cellDate = date.format('YYYY-MM-DD');
      const dateMatch = maintenanceDate === cellDate;
      
      console.log(`Manutenção ID: ${maintenance.id} | Título: ${maintenance.title} | Data: ${maintenanceDate} | Match: ${dateMatch}`);
      
      return dateMatch && partMatch && statusMatch;
    });
    
    console.log(`Encontradas ${result.length} manutenções para ${date.format('YYYY-MM-DD')}`);
    return result;
  };

  const dateCellRender = (date: Dayjs) => {
    const maintenancesForDate = getMaintenancesForDate(date);
    
    return (
      <div className="events" style={{ maxHeight: '100%', overflowY: 'auto' }}>
        {maintenancesForDate.map((maintenance: Maintenance) => {
          let bgColor = '#1890ff';
          let textColor = 'white';
          let icon = <CalendarOutlined style={{ marginRight: 4 }} />;
          
          if (maintenance.status === MaintenanceStatus.COMPLETED) {
            bgColor = '#52c41a';
            icon = <CheckCircleOutlined style={{ marginRight: 4 }} />;
          } else if (maintenance.status === MaintenanceStatus.OVERDUE) {
            bgColor = '#f5222d';
            icon = <ClockCircleOutlined style={{ marginRight: 4 }} />;
          } else if (maintenance.status === MaintenanceStatus.CANCELED) {
            bgColor = '#d9d9d9';
            textColor = 'rgba(0, 0, 0, 0.65)';
            icon = <CloseCircleOutlined style={{ marginRight: 4 }} />;
          }
          
          return (
            <div
              key={maintenance.id}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: '2px 6px',
                borderRadius: '4px',
                margin: '2px 0',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
              }}
              onClick={() => handleMaintenanceClick(maintenance)}
              title={`${maintenance.title} - ${maintenance.description || 'Sem descrição'}`}
            >
              {icon}
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {maintenance.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleMaintenanceClick = (maintenance: Maintenance) => {
    setIsCreateModalVisible(false);
    setSelectedMaintenance(maintenance);
    setIsModalVisible(true);
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.SCHEDULED:
        return 'processing';
      case MaintenanceStatus.COMPLETED:
        return 'success';
      case MaintenanceStatus.OVERDUE:
        return 'error';
      case MaintenanceStatus.CANCELED:
        return 'default';
      default:
        return 'default';
    }
  };



  const getStatusTag = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.SCHEDULED:
        return <Tag icon={<CalendarOutlined />} color="blue">Agendada</Tag>;
      case MaintenanceStatus.COMPLETED:
        return <Tag icon={<CheckCircleOutlined />} color="green">Concluída</Tag>;
      case MaintenanceStatus.OVERDUE:
        return <Tag icon={<ClockCircleOutlined />} color="red">Atrasada</Tag>;
      case MaintenanceStatus.CANCELED:
        return <Tag icon={<CloseCircleOutlined />} color="gray">Cancelada</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const handleCreateMaintenance = () => {
    form.validateFields().then((values: any) => {
      const formattedValues = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
      };
      
      if (onCreate) {
        onCreate(formattedValues);
        setIsCreateModalVisible(false);
        form.resetFields();
      }
    });
  };

  const handleDateCellClick = (date: Dayjs) => {
    setSelectedDate(date);
    console.log('Data selecionada:', date.format('YYYY-MM-DD'));
    
    const maintenancesForDate = getMaintenancesForDate(date);
    if (maintenancesForDate.length > 0) {
      handleMaintenanceClick(maintenancesForDate[0]);
    }
  };

  const [currentDate, setCurrentDate] = useState(dayjs());

  const getPartName = (partId: string | undefined): string => {
    if (!partId) return 'N/A';
    const part = parts.find(p => p.id === partId);
    return part?.name || 'Peça não encontrada';
  };

  const translateFrequency = (frequency: string): string => {
    switch (frequency) {
      case 'daily': return 'diária';
      case 'weekly': return 'semanal';
      case 'monthly': return 'mensal';
      case 'quarterly': return 'trimestral';
      case 'semi-annual': return 'semestral';
      case 'annual': return 'anual';
      case 'custom': return 'personalizada';
      default: return frequency;
    }
  };

  const renderDayView = () => {
    const maintenancesForDay = maintenances?.filter((m: Maintenance) => 
      dayjs(m.dueDate).format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')
    ) || [];

    const groupedMaintenances: Record<string, Maintenance[]> = {
      [MaintenanceStatus.SCHEDULED]: [],
      [MaintenanceStatus.COMPLETED]: [],
      [MaintenanceStatus.OVERDUE]: [],
      [MaintenanceStatus.CANCELED]: []
    };

    maintenancesForDay.forEach((maintenance: Maintenance) => {
      const status = maintenance.status as MaintenanceStatus;
      if (groupedMaintenances[status]) {
        groupedMaintenances[status].push(maintenance);
      }
    });

    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dayOfWeek = weekdays[currentDate.day()];

    return (
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 24,
            padding: '8px 0',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Button 
            type="text"
            size="large"
            icon={<LeftOutlined />} 
            onClick={() => setCurrentDate(currentDate.subtract(1, 'day'))} 
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
              {currentDate.format('DD/MM/YYYY')}
            </div>
            <div style={{ fontSize: '16px', color: '#8c8c8c' }}>
              {dayOfWeek}
            </div>
          </div>
          <Button 
            type="text"
            size="large"
            icon={<RightOutlined />} 
            onClick={() => setCurrentDate(currentDate.add(1, 'day'))} 
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16 
            }}
          >
            <h2 style={{ margin: 0 }}>Manutenções</h2>
            <Badge count={maintenancesForDay.length} style={{ backgroundColor: maintenancesForDay.length > 0 ? '#1890ff' : '#d9d9d9' }} />
          </div>

          {maintenancesForDay.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {groupedMaintenances[MaintenanceStatus.SCHEDULED].length > 0 && (
                <div>
                  <div style={{ marginBottom: 8, padding: '4px 8px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                      <CalendarOutlined style={{ marginRight: 8 }} /> Agendadas ({groupedMaintenances[MaintenanceStatus.SCHEDULED].length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedMaintenances[MaintenanceStatus.SCHEDULED].map((maintenance: Maintenance) => (
                      <Card 
                        key={maintenance.id}
                        hoverable
                        style={{ borderLeft: '4px solid #1890ff' }}
                        onClick={() => handleMaintenanceClick(maintenance)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 8 }}>{maintenance.title}</div>
                            <div style={{ color: '#595959', marginBottom: 8 }}>{maintenance.description || 'Sem descrição'}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8c8c8c' }}>
                              <span>
                                <TagOutlined style={{ marginRight: 4 }} /> {getPartName(maintenance.partId)}
                              </span>
                              <span>
                                <FieldTimeOutlined style={{ marginRight: 4 }} /> {maintenance.frequency}
                              </span>
                            </div>
                          </div>
                          <div>
                            {getStatusTag(MaintenanceStatus.SCHEDULED)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {groupedMaintenances[MaintenanceStatus.OVERDUE].length > 0 && (
                <div>
                  <div style={{ marginBottom: 8, padding: '4px 8px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#f5222d', display: 'flex', alignItems: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: 8 }} /> Atrasadas ({groupedMaintenances[MaintenanceStatus.OVERDUE].length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedMaintenances[MaintenanceStatus.OVERDUE].map((maintenance: Maintenance) => (
                      <Card 
                        key={maintenance.id}
                        hoverable
                        style={{ borderLeft: '4px solid #f5222d' }}
                        onClick={() => handleMaintenanceClick(maintenance)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 8 }}>{maintenance.title}</div>
                            <div style={{ color: '#595959', marginBottom: 8 }}>{maintenance.description || 'Sem descrição'}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8c8c8c' }}>
                              <span>
                                <TagOutlined style={{ marginRight: 4 }} /> {getPartName(maintenance.partId)}
                              </span>
                              <span>
                                <FieldTimeOutlined style={{ marginRight: 4 }} /> {maintenance.frequency}
                              </span>
                            </div>
                          </div>
                          <div>
                            {getStatusTag(MaintenanceStatus.OVERDUE)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {groupedMaintenances[MaintenanceStatus.COMPLETED].length > 0 && (
                <div>
                  <div style={{ marginBottom: 8, padding: '4px 8px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#52c41a', display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ marginRight: 8 }} /> Concluídas ({groupedMaintenances[MaintenanceStatus.COMPLETED].length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedMaintenances[MaintenanceStatus.COMPLETED].map((maintenance: Maintenance) => (
                      <Card 
                        key={maintenance.id}
                        hoverable
                        style={{ borderLeft: '4px solid #52c41a' }}
                        onClick={() => handleMaintenanceClick(maintenance)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 8 }}>{maintenance.title}</div>
                            <div style={{ color: '#595959', marginBottom: 8 }}>{maintenance.description || 'Sem descrição'}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8c8c8c' }}>
                              <span>
                                <TagOutlined style={{ marginRight: 4 }} /> {getPartName(maintenance.partId)}
                              </span>
                              <span>
                                <FieldTimeOutlined style={{ marginRight: 4 }} /> {maintenance.frequency}
                              </span>
                            </div>
                          </div>
                          <div>
                            {getStatusTag(MaintenanceStatus.COMPLETED)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Canceled */}
              {groupedMaintenances[MaintenanceStatus.CANCELED].length > 0 && (
                <div>
                  <div style={{ marginBottom: 8, padding: '4px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#8c8c8c', display: 'flex', alignItems: 'center' }}>
                      <CloseCircleOutlined style={{ marginRight: 8 }} /> Canceladas ({groupedMaintenances[MaintenanceStatus.CANCELED].length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {groupedMaintenances[MaintenanceStatus.CANCELED].map((maintenance: Maintenance) => (
                      <Card 
                        key={maintenance.id}
                        hoverable
                        style={{ borderLeft: '4px solid #d9d9d9' }}
                        onClick={() => handleMaintenanceClick(maintenance)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 8 }}>{maintenance.title}</div>
                            <div style={{ color: '#595959', marginBottom: 8 }}>{maintenance.description || 'Sem descrição'}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8c8c8c' }}>
                              <span>
                                <TagOutlined style={{ marginRight: 4 }} /> {getPartName(maintenance.partId)}
                              </span>
                              <span>
                                <FieldTimeOutlined style={{ marginRight: 4 }} /> {maintenance.frequency}
                              </span>
                            </div>
                          </div>
                          <div>
                            {getStatusTag(MaintenanceStatus.CANCELED)}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Empty 
              description={
                <div style={{ padding: '20px 0' }}>
                  <p>Nenhuma manutenção agendada para este dia</p>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      if (onAdd) {
                        onAdd(currentDate.toDate());
                      } else if (onCreate) {
                        setIsCreateModalVisible(true);
                      }
                    }}
                  >
                    Adicionar Manutenção
                  </Button>
                </div>
              } 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Radio.Group 
          value={viewMode} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newMode = e.target.value as CalendarMode;
            setViewMode(newMode);
            if (newMode === 'day') {
              setCurrentDate(selectedDate || dayjs());
            }
          }}
          style={{ marginBottom: 8 }}
          buttonStyle="solid"
        >
          <Radio.Button value="day">Dia</Radio.Button>
          <Radio.Button value="month">Mês</Radio.Button>
        </Radio.Group>
        
        <div>
          <Button 
            icon={<FilterOutlined />} 
            onClick={() => setShowFilters(!showFilters)}
            style={{ marginRight: 8 }}
          >
            Filtros
          </Button>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setIsModalVisible(false);
              onAdd ? onAdd() : setIsCreateModalVisible(true);
            }}
          >
            Nova Manutenção
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Status:</label>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Filtrar por status"
              allowClear
              value={filters.status}
              onChange={(value: any) => setFilters({...filters, status: value})}
            >
              <Select.Option value={MaintenanceStatus.SCHEDULED}>Agendada</Select.Option>
              <Select.Option value={MaintenanceStatus.COMPLETED}>Concluída</Select.Option>
              <Select.Option value={MaintenanceStatus.OVERDUE}>Atrasada</Select.Option>
              <Select.Option value={MaintenanceStatus.CANCELED}>Cancelada</Select.Option>
            </Select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Peça:</label>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Filtrar por peça"
              allowClear
              value={filters.partId}
              onChange={(value: any) => setFilters({...filters, partId: value})}
            >
              {parts.map((part: Part) => (
                <Select.Option key={part.id} value={part.id}>
                  {part.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      )}
      
      <div style={{ marginBottom: 8 }}>
        <Alert 
          message={`${maintenances?.length || 0} manutenções carregadas no total`}
          type="info"
          showIcon
          style={{ marginBottom: 8 }}
        />
      </div>
      
      {viewMode === 'day' ? (
        renderDayView()
      ) : (
        <Calendar 
          dateCellRender={dateCellRender} 
          onPanelChange={onPanelChange} 
          mode={viewMode}
          onSelect={(date: Dayjs) => {
            handleDateCellClick(date);
            setCurrentDate(date);
          }}
          style={{ background: 'white', padding: '16px', borderRadius: '8px' }}
          renderExtraFooter={(current: Dayjs) => {
            const date = dayjs(current).format('YYYY-MM-DD');
            const maintenancesCount = maintenances?.filter((m: Maintenance) => 
              dayjs(m.dueDate).format('YYYY-MM-DD') === date
            ).length || 0;
            
            return maintenancesCount > 0 ? (
              <div style={{ textAlign: 'center' }}>
                <Badge count={maintenancesCount} /> {maintenancesCount === 1 ? 'Manutenção' : 'Manutenções'}
              </div>
            ) : null;
          }}
        />
      )}
      
      <Modal
        title="Detalhes da Manutenção"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Fechar
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              onEdit(selectedMaintenance!);
              setIsModalVisible(false);
            }}
          >
            Editar
          </Button>,
          selectedMaintenance?.status === MaintenanceStatus.SCHEDULED && (
            <Button 
              key="complete" 
              type="primary" 
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => {
                onStatusChange(selectedMaintenance!.id, MaintenanceStatus.COMPLETED);
                setIsModalVisible(false);
              }}
            >
              Marcar como Concluída
            </Button>
          )
        ]}
      >
        {selectedMaintenance && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Título">{selectedMaintenance.title}</Descriptions.Item>
            <Descriptions.Item label="Descrição">{selectedMaintenance.description || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Data Limite">{dayjs(selectedMaintenance.dueDate).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(selectedMaintenance.status as MaintenanceStatus)}</Descriptions.Item>
            <Descriptions.Item label="Frequência">{translateFrequency(selectedMaintenance.frequency)}</Descriptions.Item>
            {selectedMaintenance.customDays && (
              <Descriptions.Item label="Dias Personalizados">{selectedMaintenance.customDays}</Descriptions.Item>
            )}
            <Descriptions.Item label="Tipo de Referência">{selectedMaintenance.referenceType}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>Nova Manutenção</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
        centered
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
        style={{ top: 20 }}
        maskStyle={{ backdropFilter: 'blur(2px)' }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateMaintenance}
          initialValues={{
            status: MaintenanceStatus.SCHEDULED,
            frequency: MaintenanceFrequency.MONTHLY,
            referenceType: MaintenanceReferenceType.PART_INSTALLATION,
            dueDate: selectedDate
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: "Por favor, informe o título" }]}
          >
            <Input placeholder="Digite o título da manutenção" prefix={<CalendarOutlined style={{ color: '#1890ff' }} />} />
          </Form.Item>

          <Form.Item name="description" label="Descrição">
            <Input.TextArea 
              rows={3} 
              placeholder="Descreva os detalhes da manutenção" 
              showCount 
              maxLength={500} 
              style={{ resize: 'none' }} 
            />
          </Form.Item>

          <Form.Item
            name="partId"
            label="Peça"
            rules={[{ required: true, message: "Por favor, selecione a peça" }]}
          >
            <Select
              showSearch
              placeholder="Selecione uma peça"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%' }}
              suffixIcon={<FilterOutlined style={{ color: '#1890ff' }} />}
              notFoundContent={<Empty description="Nenhuma peça encontrada" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            >
              {parts?.map((part: Part) => (
                <Select.Option key={part.id} value={part.id}>
                  {part.name} - {part.equipment?.name || 'N/A'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Data Limite"
            rules={[{ required: true, message: "Por favor, informe a data limite" }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder="Selecione a data limite"
              suffixIcon={<CalendarOutlined style={{ color: '#1890ff' }} />}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Por favor, selecione o status" }]}
          >
            <Select
              placeholder="Selecione o status"
              style={{ width: '100%' }}
              suffixIcon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            >
              <Select.Option value={MaintenanceStatus.SCHEDULED}>
                <Tag color="blue" icon={<CalendarOutlined />}>Agendada</Tag>
              </Select.Option>
              <Select.Option value={MaintenanceStatus.COMPLETED}>
                <Tag color="green" icon={<CheckCircleOutlined />}>Concluída</Tag>
              </Select.Option>
              <Select.Option value={MaintenanceStatus.OVERDUE}>
                <Tag color="red" icon={<ClockCircleOutlined />}>Atrasada</Tag>
              </Select.Option>
              <Select.Option value={MaintenanceStatus.CANCELED}>
                <Tag color="gray" icon={<CloseCircleOutlined />}>Cancelada</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="frequency"
              label="Frequência"
              rules={[{ required: true, message: "Por favor, selecione a frequência" }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Selecione a frequência"
                suffixIcon={<FieldTimeOutlined style={{ color: '#1890ff' }} />}
              >
                <Select.Option value={MaintenanceFrequency.DAILY}>Diária</Select.Option>
                <Select.Option value={MaintenanceFrequency.WEEKLY}>Semanal</Select.Option>
                <Select.Option value={MaintenanceFrequency.MONTHLY}>Mensal</Select.Option>
                <Select.Option value={MaintenanceFrequency.QUARTERLY}>Trimestral</Select.Option>
                <Select.Option value={MaintenanceFrequency.SEMI_ANNUAL}>Semestral</Select.Option>
                <Select.Option value={MaintenanceFrequency.ANNUAL}>Anual</Select.Option>
                <Select.Option value={MaintenanceFrequency.CUSTOM}>Personalizada</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="customDays"
              label="Dias (para frequência personalizada)"
              dependencies={['frequency']}
              rules={[
                ({ getFieldValue }: { getFieldValue: (field: string) => any }) => ({
                  validator(_: any, value: any) {
                    if (getFieldValue('frequency') !== MaintenanceFrequency.CUSTOM || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Informe o número de dias para frequência personalizada'));
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <Input 
                type="number" 
                min={1} 
                placeholder="Número de dias"
                disabled={form.getFieldValue('frequency') !== MaintenanceFrequency.CUSTOM}
                suffix="dias"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="referenceType"
            label="Referência para cálculo"
            rules={[{ required: true, message: "Por favor, selecione o tipo de referência" }]}
            tooltip={{ title: 'A referência é usada para calcular a próxima data de manutenção com base na frequência', icon: <InfoCircleOutlined /> }}
          >
            <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
              <Radio.Button value={MaintenanceReferenceType.PART_INSTALLATION} style={{ width: '33.3%', textAlign: 'center' }}>
                <Tooltip title="Data de instalação da peça">
                  <ToolOutlined style={{ marginRight: 4 }} /> Peça
                </Tooltip>
              </Radio.Button>
              <Radio.Button value={MaintenanceReferenceType.EQUIPMENT_OPERATION} style={{ width: '33.3%', textAlign: 'center' }}>
                <Tooltip title="Data de operação do equipamento">
                  <SettingOutlined style={{ marginRight: 4 }} /> Equipamento
                </Tooltip>
              </Radio.Button>
              <Radio.Button value={MaintenanceReferenceType.FIXED_DATE} style={{ width: '33.3%', textAlign: 'center' }}>
                <Tooltip title="Data fixa">
                  <CalendarOutlined style={{ marginRight: 4 }} /> Data fixa
                </Tooltip>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Tooltip title="Limpar todos os campos">
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={() => form.resetFields()}
                    style={{ marginRight: 8 }}
                  >
                    Limpar
                  </Button>
                </Tooltip>
              </div>
              <div>
                <Button 
                  onClick={() => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                  }}
                  style={{ marginRight: 8 }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<CheckOutlined />}
                >
                  Criar Manutenção
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaintenanceCalendar;
